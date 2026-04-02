export default function Panel({ children, title, actions, style }) {
  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid #21262D',
      borderRadius: 12,
      padding: 24,
      ...style,
    }}>
      {(title || actions) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          {title && (
            <h3 style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#E6EDF3',
              margin: 0,
            }}>
              {title}
            </h3>
          )}
          {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
