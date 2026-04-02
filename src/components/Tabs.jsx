export default function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      background: '#0D1117',
      border: '1px solid #21262D',
      borderRadius: 12,
      padding: 4,
    }}>
      {tabs.map(tab => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s ease',
              background: isActive ? '#161B22' : 'transparent',
              color: isActive ? '#E6EDF3' : '#8B949E',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {tab.icon && <span style={{ fontSize: 16 }}>{tab.icon}</span>}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
