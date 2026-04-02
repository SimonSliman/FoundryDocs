export default function Metric({ label, value, sub, color, style }) {
  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid #21262D',
      borderRadius: 12,
      padding: '20px 24px',
      minWidth: 160,
      flex: 1,
      ...style,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#8B949E',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 28,
        fontWeight: 700,
        color: color || '#E6EDF3',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: 12,
          color: '#484F58',
          marginTop: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {sub}
        </div>
      )}
    </div>
  )
}
