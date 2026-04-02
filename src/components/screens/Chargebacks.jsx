import { useState, useRef, useCallback } from 'react'
import Papa from 'papaparse'
import Metric from '../Metric'
import Panel from '../Panel'
import Pill from '../Pill'

const SAMPLE_CSV = `id,merchant,amount,reason,date,card_last4,currency
CB-2401,KFC LATAM,3420.00,Unauthorized transaction,2026-02-15,4521,MXN
CB-2402,Sony Store MX,12800.50,Duplicate charge,2026-02-17,8832,USD
CB-2403,Volaris,890.00,Product not received,2026-02-19,3341,MXN
CB-2404,Clic Air,2150.75,Amount differs from receipt,2026-02-21,6612,USD
CB-2405,GetJusto,445.00,Unauthorized transaction,2026-02-23,9981,COP
CB-2406,KFC LATAM,6700.00,Card not present fraud,2026-02-25,4521,MXN
CB-2407,Rappi Pay,1230.00,Subscription not cancelled,2026-02-27,7745,BRL
CB-2408,Sony Store MX,8900.00,Unauthorized transaction,2026-03-01,2234,USD
CB-2409,Volaris,3300.00,Duplicate charge,2026-03-04,5567,MXN
CB-2410,KFC LATAM,1580.00,Amount differs,2026-03-07,4521,MXN
CB-2411,Clic Air,22400.00,Card not present fraud,2026-03-10,8891,USD
CB-2412,GetJusto,670.00,Unauthorized transaction,2026-03-13,3345,COP
CB-2413,Rappi Pay,4100.00,Product not received,2026-03-16,7712,BRL
CB-2414,KFC LATAM,950.00,Duplicate charge,2026-03-19,4521,MXN
CB-2415,Sony Store MX,15200.00,Unauthorized transaction,2026-03-22,6678,USD
CB-2416,Volaris,2800.00,Subscription not cancelled,2026-03-25,1123,MXN
CB-2417,KFC LATAM,7600.00,Card not present fraud,2026-03-27,4521,MXN
CB-2418,Clic Air,1100.00,Amount differs,2026-03-28,9934,USD`

const reasonCategories = {
  'Fraud': ['unauthorized', 'fraud', 'card not present', 'no autorizado', 'fraude', 'tarjeta no presente'],
  'Duplicate': ['duplicate', 'duplicado', 'doble cargo'],
  'Product/Service': ['product not received', 'not received', 'subscription', 'producto no recibido', 'suscripción', 'no entregado'],
  'Amount Dispute': ['amount differs', 'amount', 'monto', 'diferencia', 'receipt'],
}

function categorize(reason) {
  const lower = (reason || '').toLowerCase()
  for (const [cat, keywords] of Object.entries(reasonCategories)) {
    if (keywords.some(kw => lower.includes(kw))) return cat
  }
  return 'Other'
}

const categoryColors = {
  'Fraud': '#F87171',
  'Duplicate': '#FBBF24',
  'Product/Service': '#60A5FA',
  'Amount Dispute': '#A78BFA',
  'Other': '#8B949E',
}

const aiRecommendations = [
  { title: 'Block Repeat Fraud Cards', desc: '4 chargebacks from card ending 4521 (KFC LATAM). Recommend blocking this card and flagging the merchant for enhanced verification.', severity: 'high' },
  { title: 'Merchant Alert: Clic Air', desc: 'High-value chargebacks ($25,650 total). Pattern suggests authorization issues. Recommend enabling 3DS for transactions over $1,000.', severity: 'high' },
  { title: 'Subscription Cancellation Flow', desc: '2 chargebacks related to subscription not cancelled. Recommend implementing real-time cancellation confirmation + grace period refunds.', severity: 'medium' },
  { title: 'Duplicate Detection Gap', desc: '3 duplicate charge disputes detected. Your current dedup window is 60s — recommend extending to 300s for LATAM payment rails.', severity: 'medium' },
]

export default function Chargebacks() {
  const [data, setData] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  const processData = useCallback((csvString) => {
    const result = Papa.parse(csvString.trim(), { header: true, skipEmptyLines: true })
    const rows = result.data.map(row => ({
      ...row,
      amount: parseFloat(row.amount) || 0,
      category: categorize(row.reason),
    }))
    setData(rows)
  }, [])

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => processData(e.target.result)
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500, gap: 24 }}>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', maxWidth: 560, padding: '60px 40px',
            border: `2px dashed ${dragging ? '#10B981' : '#21262D'}`,
            borderRadius: 16, textAlign: 'center', cursor: 'pointer',
            background: dragging ? 'rgba(16, 185, 129, 0.04)' : '#0D1117',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>📁</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#E6EDF3', marginBottom: 8 }}>
            Upload Chargeback File
          </div>
          <div style={{ fontSize: 14, color: '#8B949E', marginBottom: 20 }}>
            Drag and drop a CSV file here, or click to browse
          </div>
          <div style={{ fontSize: 12, color: '#484F58' }}>
            Supports: .csv files with columns: id, merchant, amount, reason, date, card_last4, currency
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>
        <button
          onClick={() => processData(SAMPLE_CSV)}
          style={{
            padding: '12px 28px', borderRadius: 8, border: '1px solid #21262D',
            background: '#161B22', color: '#E6EDF3', fontSize: 14,
            fontWeight: 500, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#10B981'; e.target.style.color = '#10B981' }}
          onMouseLeave={e => { e.target.style.borderColor = '#21262D'; e.target.style.color = '#E6EDF3' }}
        >
          Load Sample Data (Feb 13 – Mar 28)
        </button>
      </div>
    )
  }

  // Analysis
  const totalAmount = data.reduce((s, r) => s + r.amount, 0)
  const categoryBreakdown = {}
  const merchantBreakdown = {}
  const cardFrequency = {}

  data.forEach(r => {
    categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1
    if (!merchantBreakdown[r.merchant]) merchantBreakdown[r.merchant] = { count: 0, total: 0 }
    merchantBreakdown[r.merchant].count += 1
    merchantBreakdown[r.merchant].total += r.amount
    const cardKey = `****${r.card_last4}`
    cardFrequency[cardKey] = (cardFrequency[cardKey] || 0) + 1
  })

  const repeatCards = Object.entries(cardFrequency)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])

  const sortedMerchants = Object.entries(merchantBreakdown)
    .sort((a, b) => b[1].total - a[1].total)

  const maxCat = Math.max(...Object.values(categoryBreakdown))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Metric label="Total Chargebacks" value={data.length} color="#F87171" sub={`Feb 15 – Mar 28`} />
        <Metric label="Total Amount" value={`$${(totalAmount / 1000).toFixed(1)}K`} color="#F87171" sub="All currencies" />
        <Metric label="Top Category" value={Object.entries(categoryBreakdown).sort((a,b) => b[1] - a[1])[0]?.[0] || '—'} color="#FBBF24" sub={`${Object.entries(categoryBreakdown).sort((a,b) => b[1] - a[1])[0]?.[1] || 0} cases`} />
        <Metric label="Repeat Offenders" value={repeatCards.length} color="#F87171" sub="Cards with 2+ chargebacks" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Root Cause Breakdown */}
        <Panel title="Root Cause Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: categoryColors[cat] || '#8B949E', fontWeight: 500 }}>{cat}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#E6EDF3' }}>
                    {count} <span style={{ color: '#484F58', fontSize: 11 }}>({((count / data.length) * 100).toFixed(0)}%)</span>
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#161B22', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${(count / maxCat) * 100}%`,
                    background: categoryColors[cat] || '#8B949E',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* By Merchant */}
        <Panel title="By Merchant">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedMerchants.map(([merchant, info]) => (
              <div key={merchant} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 8,
                border: '1px solid #1C1F26',
                background: '#0D1117',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#E6EDF3' }}>{merchant}</span>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8B949E' }}>
                    {info.count} cases
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    fontWeight: 600, color: '#F87171',
                  }}>
                    ${info.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Repeat Offenders */}
      {repeatCards.length > 0 && (
        <Panel title={<span>Repeat Offender Cards <Pill color="red" style={{ marginLeft: 8 }}>{repeatCards.length} flagged</Pill></span>}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {repeatCards.map(([card, count]) => {
              const cardTxs = data.filter(r => `****${r.card_last4}` === card)
              const cardTotal = cardTxs.reduce((s, r) => s + r.amount, 0)
              return (
                <div key={card} style={{
                  padding: '16px 20px', borderRadius: 12,
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                  background: 'rgba(248, 113, 113, 0.04)',
                  minWidth: 200,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16, fontWeight: 700, color: '#E6EDF3', marginBottom: 4,
                  }}>{card}</div>
                  <div style={{ fontSize: 12, color: '#F87171', fontWeight: 600 }}>
                    {count} chargebacks · ${cardTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: 11, color: '#8B949E', marginTop: 4 }}>
                    Merchants: {[...new Set(cardTxs.map(t => t.merchant))].join(', ')}
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      )}

      {/* AI Recommendations */}
      <Panel title={<span>AI Recommendations <Pill color="blue" style={{ marginLeft: 8 }}>Auto-generated</Pill></span>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {aiRecommendations.map((rec, i) => (
            <div key={i} style={{
              padding: '16px 20px', borderRadius: 10,
              border: `1px solid ${rec.severity === 'high' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`,
              background: rec.severity === 'high' ? 'rgba(248, 113, 113, 0.03)' : 'rgba(251, 191, 36, 0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Pill color={rec.severity === 'high' ? 'red' : 'yellow'}>
                  {rec.severity.toUpperCase()}
                </Pill>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#E6EDF3' }}>{rec.title}</span>
              </div>
              <div style={{ fontSize: 13, color: '#8B949E', lineHeight: 1.5 }}>{rec.desc}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Raw Data */}
      <Panel
        title={`Chargeback Data (${data.length} records)`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setData(null)} style={{
              padding: '6px 14px', borderRadius: 8, border: '1px solid #21262D',
              background: 'transparent', color: '#8B949E', fontSize: 12,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>Upload New File</button>
            <button style={{
              padding: '6px 14px', borderRadius: 8, border: '1px solid #21262D',
              background: '#161B22', color: '#E6EDF3', fontSize: 12,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>Export Report</button>
          </div>
        }
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '90px 130px 100px 1fr 100px 80px 70px',
            gap: 0, fontSize: 12,
          }}>
            {['ID', 'Merchant', 'Amount', 'Reason', 'Date', 'Card', 'Category'].map(h => (
              <div key={h} style={{
                padding: '8px 10px', fontWeight: 600, fontSize: 10,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: '#484F58', borderBottom: '1px solid #21262D',
                position: 'sticky', top: 0, background: '#0D1117', zIndex: 1,
              }}>{h}</div>
            ))}
            {data.map(row => (
              ['id', 'merchant', 'amount', 'reason', 'date', 'card_last4', 'category'].map(key => (
                <div key={`${row.id}-${key}`} style={{
                  padding: '10px 10px', borderBottom: '1px solid #161B22',
                  color: key === 'id' ? '#60A5FA' : key === 'category' ? (categoryColors[row.category] || '#8B949E') : '#8B949E',
                  fontFamily: (key === 'amount' || key === 'id' || key === 'card_last4' || key === 'date') ? "'JetBrains Mono', monospace" : 'inherit',
                  fontSize: 11,
                  fontWeight: key === 'amount' ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {key === 'amount' ? `$${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` :
                   key === 'card_last4' ? `****${row[key]}` :
                   key === 'category' ? row.category :
                   row[key]}
                </div>
              ))
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}
