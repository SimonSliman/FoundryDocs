import { useState, useEffect, useRef } from 'react'
import Metric from '../Metric'
import Pill from '../Pill'
import Panel from '../Panel'

const providers = ['Stripe', 'Adyen', 'dLocal', 'Mercado Pago', 'PayU', 'Kushki', 'Conekta', 'EBANX']
const merchants = ['KFC LATAM', 'Sony Store', 'Volaris', 'Clic Air', 'GetJusto', 'Rappi Pay']
const currencies = ['MXN', 'USD', 'COP', 'BRL', 'PEN', 'ARS']
const statuses = ['settled', 'settled', 'settled', 'settled', 'pending', 'flagged']

function generateTx(id) {
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  return {
    id: `TXN-${String(id).padStart(5, '0')}`,
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    amount: (Math.random() * 25000 + 100).toFixed(2),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    provider: providers[Math.floor(Math.random() * providers.length)],
    status,
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
  }
}

const statusColors = { settled: 'green', pending: 'yellow', flagged: 'red' }

export default function Settlement() {
  const [transactions, setTransactions] = useState(() => {
    const initial = []
    for (let i = 0; i < 12; i++) initial.push(generateTx(10042 + i))
    return initial
  })
  const [totalSettled, setTotalSettled] = useState(2847563.42)
  const [txCount, setTxCount] = useState(10054)
  const counterRef = useRef(10054)
  const listRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      counterRef.current += 1
      const tx = generateTx(counterRef.current)
      setTransactions(prev => [tx, ...prev.slice(0, 49)])
      if (tx.status === 'settled') {
        setTotalSettled(prev => prev + parseFloat(tx.amount))
      }
      setTxCount(prev => prev + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Metric label="Total Settled Today" value={`$${(totalSettled / 1000000).toFixed(2)}M`} color="#10B981" sub="↑ 12.3% vs yesterday" />
        <Metric label="Transactions" value={txCount.toLocaleString()} color="#60A5FA" sub="Last 24 hours" />
        <Metric label="Settlement Rate" value="99.7%" color="#10B981" sub="Target: 99.5%" />
        <Metric label="Avg Settlement Time" value="1.2s" color="#FBBF24" sub="↓ 340ms improvement" />
      </div>

      <Panel
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#10B981',
              boxShadow: '0 0 8px #10B981',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
            Live Settlement Feed
            <Pill color="green" style={{ marginLeft: 4 }}>LIVE</Pill>
          </span>
        }
      >
        <div ref={listRef} style={{ maxHeight: 480, overflowY: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 120px 80px 120px 100px 80px',
            gap: '0',
            fontSize: 13,
          }}>
            {/* Header */}
            {['TX ID', 'Merchant', 'Amount', 'Currency', 'Provider', 'Status', 'Time'].map(h => (
              <div key={h} style={{
                padding: '10px 12px',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#484F58',
                borderBottom: '1px solid #21262D',
                position: 'sticky',
                top: 0,
                background: '#0D1117',
                zIndex: 1,
              }}>{h}</div>
            ))}
            {/* Rows */}
            {transactions.map((tx, i) => (
              ['id', 'merchant', 'amount', 'currency', 'provider', 'status', 'time'].map((key, ci) => (
                <div key={`${tx.id}-${key}`} style={{
                  padding: '12px 12px',
                  borderBottom: '1px solid #161B22',
                  color: key === 'id' ? '#60A5FA' : key === 'amount' ? '#E6EDF3' : '#8B949E',
                  fontFamily: (key === 'amount' || key === 'id' || key === 'time') ? "'JetBrains Mono', monospace" : 'inherit',
                  fontSize: key === 'amount' ? 13 : 12,
                  fontWeight: key === 'amount' ? 600 : 400,
                  transition: 'background 0.3s ease',
                  background: i === 0 ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                }}>
                  {key === 'status' ? (
                    <Pill color={statusColors[tx.status]}>{tx.status}</Pill>
                  ) : key === 'amount' ? (
                    `$${parseFloat(tx.amount).toLocaleString()}`
                  ) : (
                    tx[key]
                  )}
                </div>
              ))
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}
