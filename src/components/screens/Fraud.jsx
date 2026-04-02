import { useState } from 'react'
import Metric from '../Metric'
import Panel from '../Panel'
import Pill from '../Pill'

const initialTransactions = [
  { id: 'FRD-001', merchant: 'KFC LATAM', amount: 48500.00, currency: 'MXN', risk: 94, reason: 'Velocity spike — 12 txns in 2 min from same IP', card: '****4521', country: 'MX', status: 'flagged' },
  { id: 'FRD-002', merchant: 'Sony Store MX', amount: 89200.00, currency: 'USD', risk: 97, reason: 'Card testing pattern — sequential amounts $1, $2, $5, $89K', card: '****2234', country: 'US', status: 'flagged' },
  { id: 'FRD-003', merchant: 'Clic Air', amount: 15600.00, currency: 'USD', risk: 88, reason: 'Geo mismatch — card issued BR, transaction from NG', card: '****8891', country: 'NG', status: 'flagged' },
  { id: 'FRD-004', merchant: 'GetJusto', amount: 2340.00, currency: 'COP', risk: 72, reason: 'New device + high value — first transaction on this device', card: '****3345', country: 'CO', status: 'flagged' },
  { id: 'FRD-005', merchant: 'Rappi Pay', amount: 6780.00, currency: 'BRL', risk: 85, reason: 'BIN mismatch — card type not typical for merchant category', card: '****7712', country: 'BR', status: 'flagged' },
  { id: 'FRD-006', merchant: 'Volaris', amount: 124000.00, currency: 'MXN', risk: 91, reason: 'Bulk purchase pattern — 8 one-way tickets, different names', card: '****1123', country: 'MX', status: 'flagged' },
]

const rules = [
  { name: 'Velocity Check', desc: 'Max 5 transactions per card in 10 min window', triggers: 847, blocked: 312, status: 'active' },
  { name: 'Geo Mismatch', desc: 'Card issuing country ≠ transaction origin country', triggers: 234, blocked: 89, status: 'active' },
  { name: 'Card Testing', desc: 'Sequential small amounts followed by large charge', triggers: 156, blocked: 142, status: 'active' },
  { name: 'BIN Analysis', desc: 'Card type / merchant category code mismatch', triggers: 423, blocked: 167, status: 'active' },
  { name: 'Device Fingerprint', desc: 'New device + high value transaction threshold', triggers: 312, blocked: 98, status: 'active' },
  { name: 'Amount Threshold', desc: 'Auto-flag transactions above $50K USD equivalent', triggers: 67, blocked: 23, status: 'active' },
]

function getRiskColor(risk) {
  if (risk >= 90) return '#F87171'
  if (risk >= 80) return '#FBBF24'
  if (risk >= 70) return '#60A5FA'
  return '#10B981'
}

export default function Fraud() {
  const [transactions, setTransactions] = useState(initialTransactions)

  const handleBlock = (id) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'blocked' } : t))
  }

  const flaggedCount = transactions.filter(t => t.status === 'flagged').length
  const blockedCount = transactions.filter(t => t.status === 'blocked').length
  const totalAtRisk = transactions.filter(t => t.status === 'flagged').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Metric label="Flagged Transactions" value={flaggedCount} color="#F87171" sub="Requires review" />
        <Metric label="Blocked Today" value={blockedCount + 23} color="#FBBF24" sub="Auto + manual" />
        <Metric label="Amount at Risk" value={`$${(totalAtRisk / 1000).toFixed(0)}K`} color="#F87171" sub="Flagged transactions" />
        <Metric label="False Positive Rate" value="2.1%" color="#10B981" sub="Industry avg: 8.4%" />
      </div>

      {/* Flagged Transactions */}
      <Panel title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          Flagged Transactions
          <Pill color="red">{flaggedCount} active</Pill>
        </span>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {transactions.map(tx => (
            <div key={tx.id} style={{
              padding: '16px 20px', borderRadius: 10,
              border: `1px solid ${tx.status === 'blocked' ? 'rgba(139, 148, 158, 0.2)' : 'rgba(248, 113, 113, 0.15)'}`,
              background: tx.status === 'blocked' ? 'rgba(139, 148, 158, 0.03)' : 'rgba(248, 113, 113, 0.02)',
              opacity: tx.status === 'blocked' ? 0.6 : 1,
              transition: 'all 0.3s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: '#60A5FA',
                  }}>{tx.id}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#E6EDF3' }}>{tx.merchant}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14, fontWeight: 700, color: '#E6EDF3',
                  }}>${tx.amount.toLocaleString()}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: '#484F58',
                  }}>{tx.currency}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Risk Score */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 48, height: 6, borderRadius: 3,
                      background: '#161B22', overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${tx.risk}%`, height: '100%', borderRadius: 3,
                        background: getRiskColor(tx.risk),
                      }} />
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13, fontWeight: 700,
                      color: getRiskColor(tx.risk),
                    }}>{tx.risk}</span>
                  </div>
                  {tx.status === 'blocked' ? (
                    <span style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: 'rgba(139, 148, 158, 0.12)', color: '#8B949E',
                    }}>Blocked</span>
                  ) : (
                    <button onClick={() => handleBlock(tx.id)} style={{
                      padding: '6px 14px', borderRadius: 8, border: 'none',
                      background: '#F87171', color: '#fff', fontSize: 12,
                      fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'opacity 0.2s',
                    }} onMouseEnter={e => e.target.style.opacity = '0.85'}
                       onMouseLeave={e => e.target.style.opacity = '1'}>
                      Block
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 12, color: '#8B949E', flex: 1 }}>{tx.reason}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: '#484F58',
                }}>{tx.card}</span>
                <Pill color="gray">{tx.country}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Fraud Rules */}
      <Panel title="Active Fraud Rules">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr 100px 100px 80px',
          gap: 0, fontSize: 13,
        }}>
          {['Rule', 'Description', 'Triggers', 'Blocked', 'Status'].map(h => (
            <div key={h} style={{
              padding: '10px 12px', fontWeight: 600, fontSize: 11,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: '#484F58', borderBottom: '1px solid #21262D',
            }}>{h}</div>
          ))}
          {rules.map(rule => (
            ['name', 'desc', 'triggers', 'blocked', 'status'].map(key => (
              <div key={`${rule.name}-${key}`} style={{
                padding: '12px 12px', borderBottom: '1px solid #161B22',
                color: key === 'name' ? '#E6EDF3' : key === 'blocked' ? '#F87171' : '#8B949E',
                fontFamily: (key === 'triggers' || key === 'blocked') ? "'JetBrains Mono', monospace" : 'inherit',
                fontWeight: key === 'name' ? 500 : 400,
                fontSize: 12,
              }}>
                {key === 'status' ? <Pill color="green">Active</Pill> :
                 key === 'triggers' || key === 'blocked' ? rule[key].toLocaleString() :
                 rule[key]}
              </div>
            ))
          ))}
        </div>
      </Panel>
    </div>
  )
}
