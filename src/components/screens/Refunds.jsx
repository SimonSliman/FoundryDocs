import { useState } from 'react'
import Metric from '../Metric'
import Panel from '../Panel'
import Pill from '../Pill'

const initialRefunds = [
  { id: 'REF-9001', merchant: 'KFC LATAM', amount: 1250.00, currency: 'MXN', reason: 'Double charge detected', confidence: 98, autoResolvable: true, status: 'pending', time: '2m ago' },
  { id: 'REF-9002', merchant: 'Sony Store MX', amount: 4800.00, currency: 'USD', reason: 'Product return — receipt verified', confidence: 95, autoResolvable: true, status: 'pending', time: '5m ago' },
  { id: 'REF-9003', merchant: 'Volaris', amount: 890.00, currency: 'MXN', reason: 'Flight cancellation — policy match', confidence: 92, autoResolvable: true, status: 'pending', time: '8m ago' },
  { id: 'REF-9004', merchant: 'GetJusto', amount: 320.00, currency: 'COP', reason: 'Order not delivered — GPS verified', confidence: 88, autoResolvable: false, status: 'pending', time: '12m ago' },
  { id: 'REF-9005', merchant: 'Rappi Pay', amount: 2100.00, currency: 'BRL', reason: 'Subscription overcharge', confidence: 96, autoResolvable: true, status: 'pending', time: '15m ago' },
  { id: 'REF-9006', merchant: 'Clic Air', amount: 15400.00, currency: 'USD', reason: 'Duplicate booking — awaiting review', confidence: 72, autoResolvable: false, status: 'review', time: '22m ago' },
  { id: 'REF-9007', merchant: 'KFC LATAM', amount: 680.00, currency: 'MXN', reason: 'Incorrect amount charged', confidence: 94, autoResolvable: true, status: 'pending', time: '25m ago' },
  { id: 'REF-9008', merchant: 'Sony Store MX', amount: 22000.00, currency: 'USD', reason: 'Bulk return — manual verification needed', confidence: 65, autoResolvable: false, status: 'review', time: '31m ago' },
]

export default function Refunds() {
  const [refunds, setRefunds] = useState(initialRefunds)

  const handleApprove = (id) => {
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
  }

  const pendingCount = refunds.filter(r => r.status === 'pending').length
  const approvedCount = refunds.filter(r => r.status === 'approved').length
  const totalAmount = refunds.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Metric label="Pending Refunds" value={pendingCount} color="#FBBF24" sub="Awaiting approval" />
        <Metric label="Approved Today" value={approvedCount} color="#10B981" sub="Auto + manual" />
        <Metric label="Total Value" value={`$${(totalAmount / 1000).toFixed(1)}K`} color="#60A5FA" sub="All currencies" />
        <Metric label="Avg Resolution" value="47s" color="#10B981" sub="Was 2.3 days" />
      </div>

      <Panel title="Smart Refund Queue" actions={
        <Pill color="blue">{refunds.filter(r => r.autoResolvable && r.status === 'pending').length} auto-resolvable</Pill>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {refunds.map(r => (
            <div key={r.id} style={{
              display: 'grid',
              gridTemplateColumns: '100px 130px 100px 1fr 80px 110px',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 8,
              border: '1px solid #1C1F26',
              background: r.status === 'approved' ? 'rgba(16, 185, 129, 0.04)' : '#0D1117',
              transition: 'all 0.3s ease',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, color: '#60A5FA',
              }}>{r.id}</span>
              <span style={{ fontSize: 13, color: '#E6EDF3', fontWeight: 500 }}>{r.merchant}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13, fontWeight: 600, color: '#E6EDF3',
              }}>
                ${r.amount.toLocaleString()} <span style={{ color: '#484F58', fontSize: 11 }}>{r.currency}</span>
              </span>
              <div>
                <div style={{ fontSize: 12, color: '#8B949E' }}>{r.reason}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                  <div style={{
                    width: 60, height: 4, borderRadius: 2,
                    background: '#21262D', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${r.confidence}%`, height: '100%', borderRadius: 2,
                      background: r.confidence >= 90 ? '#10B981' : r.confidence >= 80 ? '#FBBF24' : '#F87171',
                    }} />
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: r.confidence >= 90 ? '#10B981' : r.confidence >= 80 ? '#FBBF24' : '#F87171',
                  }}>{r.confidence}%</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#484F58' }}>{r.time}</span>
              <div>
                {r.status === 'approved' ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'rgba(16, 185, 129, 0.12)', color: '#10B981',
                  }}>Approved ✓</span>
                ) : r.status === 'review' ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: 'rgba(251, 191, 36, 0.12)', color: '#FBBF24',
                  }}>Needs Review</span>
                ) : (
                  <button onClick={() => handleApprove(r.id)} style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none',
                    background: '#10B981', color: '#fff', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'opacity 0.2s',
                  }} onMouseEnter={e => e.target.style.opacity = '0.85'}
                     onMouseLeave={e => e.target.style.opacity = '1'}>
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
