import { useState } from 'react'
import { Link } from 'react-router-dom'
import Tabs from '../components/Tabs'
import Settlement from '../components/screens/Settlement'
import Reconciliation from '../components/screens/Reconciliation'
import Refunds from '../components/screens/Refunds'
import Chargebacks from '../components/screens/Chargebacks'
import Fraud from '../components/screens/Fraud'

const tabs = [
  { key: 'settlement', label: 'Settlement', icon: '⚡' },
  { key: 'reconciliation', label: 'Reconciliation', icon: '🔄' },
  { key: 'refunds', label: 'Refunds', icon: '↩️' },
  { key: 'chargebacks', label: 'Chargebacks', icon: '🛡️' },
  { key: 'fraud', label: 'Fraud', icon: '🚨' },
]

const screens = {
  settlement: Settlement,
  reconciliation: Reconciliation,
  refunds: Refunds,
  chargebacks: Chargebacks,
  fraud: Fraud,
}

export default function Demo() {
  const [activeTab, setActiveTab] = useState('settlement')
  const Screen = screens[activeTab]

  return (
    <div style={{ minHeight: '100vh', background: '#06090F' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 28px',
        borderBottom: '1px solid #21262D',
        background: '#0D1117',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #10B981, #60A5FA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
            }}>S</div>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#E6EDF3' }}>Settlement Engine</span>
          </Link>
          <span style={{
            fontSize: 11, color: '#484F58', fontWeight: 500,
            padding: '2px 8px', borderRadius: 6,
            border: '1px solid #21262D', marginLeft: 4,
          }}>DEMO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#10B981',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#10B981', boxShadow: '0 0 6px #10B981',
            }} />
            All systems operational
          </span>
        </div>
      </header>

      {/* Main */}
      <div style={{ padding: '20px 28px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
        <Screen />
      </div>
    </div>
  )
}
