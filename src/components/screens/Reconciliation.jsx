import Metric from '../Metric'
import Panel from '../Panel'
import Pill from '../Pill'

const oldWaySteps = [
  { step: 1, action: 'Export CSV from payment provider', time: '15 min', status: 'manual' },
  { step: 2, action: 'Export CSV from bank portal', time: '10 min', status: 'manual' },
  { step: 3, action: 'Open both in Excel, run VLOOKUP', time: '45 min', status: 'manual' },
  { step: 4, action: 'Flag mismatches, email finance team', time: '20 min', status: 'manual' },
  { step: 5, action: 'Wait for response from ops team', time: '2-4 hours', status: 'blocked' },
  { step: 6, action: 'Manually adjust ledger entries', time: '30 min', status: 'manual' },
  { step: 7, action: 'Generate reconciliation report', time: '20 min', status: 'manual' },
  { step: 8, action: 'Send for CFO approval', time: '1-2 days', status: 'blocked' },
]

const newWaySteps = [
  { step: 1, action: 'Auto-ingest from all providers (API)', time: '0s', status: 'auto' },
  { step: 2, action: 'Real-time matching engine runs', time: '1.2s', status: 'auto' },
  { step: 3, action: 'Exceptions flagged with root cause', time: '0.3s', status: 'auto' },
  { step: 4, action: 'One-click resolve or auto-resolve', time: '2s', status: 'auto' },
]

const stepStatusStyle = {
  manual: { bg: 'rgba(248, 113, 113, 0.12)', text: '#F87171' },
  blocked: { bg: 'rgba(251, 191, 36, 0.12)', text: '#FBBF24' },
  auto: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981' },
}

const matchData = [
  { provider: 'Stripe', transactions: 12847, matched: 12841, rate: '99.95%', unmatched: 6 },
  { provider: 'Adyen', transactions: 8432, matched: 8429, rate: '99.96%', unmatched: 3 },
  { provider: 'dLocal', transactions: 5621, matched: 5608, rate: '99.77%', unmatched: 13 },
  { provider: 'Mercado Pago', transactions: 15203, matched: 15187, rate: '99.89%', unmatched: 16 },
  { provider: 'PayU', transactions: 3894, matched: 3891, rate: '99.92%', unmatched: 3 },
]

export default function Reconciliation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Metric label="Match Rate" value="99.91%" color="#10B981" sub="Across all providers" />
        <Metric label="Unmatched" value="41" color="#F87171" sub="Down from 2,340" />
        <Metric label="Reconciliation Time" value="3.5s" color="#60A5FA" sub="Was 6-8 hours" />
        <Metric label="Cost Savings" value="$184K" color="#FBBF24" sub="Annual projection" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Old Way */}
        <Panel title={<span>❌ The Old Way <Pill color="red" style={{ marginLeft: 8 }}>6-8 hours</Pill></span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {oldWaySteps.map(s => {
              const st = stepStatusStyle[s.status]
              return (
                <div key={s.step} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(248, 113, 113, 0.04)',
                  border: '1px solid #1C1F26',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 600, color: '#484F58',
                    width: 20, textAlign: 'center',
                  }}>{s.step}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#8B949E' }}>{s.action}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: st.text,
                  }}>{s.time}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 10,
                    background: st.bg, color: st.text,
                  }}>{s.status}</span>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* New Way */}
        <Panel title={<span>✅ With Settlement Engine <Pill color="green" style={{ marginLeft: 8 }}>3.5 seconds</Pill></span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {newWaySteps.map(s => {
              const st = stepStatusStyle[s.status]
              return (
                <div key={s.step} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.04)',
                  border: '1px solid #1C1F26',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 600, color: '#484F58',
                    width: 20, textAlign: 'center',
                  }}>{s.step}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#E6EDF3' }}>{s.action}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: st.text,
                  }}>{s.time}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 10,
                    background: st.bg, color: st.text,
                  }}>{s.status}</span>
                </div>
              )
            })}
          </div>
          <div style={{
            marginTop: 20, padding: 16, borderRadius: 8,
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}>
            <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600, marginBottom: 4 }}>
              Time saved per reconciliation cycle
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: '#10B981' }}>
              6h 47m → 3.5s
            </div>
            <div style={{ fontSize: 12, color: '#8B949E', marginTop: 4 }}>
              99.95% reduction in reconciliation time
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Provider Match Rates">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 120px 100px 100px',
          gap: 0, fontSize: 13,
        }}>
          {['Provider', 'Transactions', 'Matched', 'Rate', 'Unmatched'].map(h => (
            <div key={h} style={{
              padding: '10px 12px', fontWeight: 600, fontSize: 11,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: '#484F58', borderBottom: '1px solid #21262D',
            }}>{h}</div>
          ))}
          {matchData.map(row => (
            ['provider', 'transactions', 'matched', 'rate', 'unmatched'].map(key => (
              <div key={`${row.provider}-${key}`} style={{
                padding: '12px 12px', borderBottom: '1px solid #161B22',
                color: key === 'rate' ? '#10B981' : key === 'unmatched' ? '#F87171' : '#8B949E',
                fontFamily: key !== 'provider' ? "'JetBrains Mono', monospace" : 'inherit',
                fontWeight: key === 'rate' ? 600 : 400,
                fontSize: 12,
              }}>
                {key === 'transactions' || key === 'matched' || key === 'unmatched'
                  ? row[key].toLocaleString()
                  : row[key]}
              </div>
            ))
          ))}
        </div>
      </Panel>
    </div>
  )
}
