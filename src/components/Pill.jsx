const colorMap = {
  green: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981' },
  red: { bg: 'rgba(248, 113, 113, 0.15)', text: '#F87171' },
  yellow: { bg: 'rgba(251, 191, 36, 0.15)', text: '#FBBF24' },
  blue: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA' },
  gray: { bg: 'rgba(139, 148, 158, 0.15)', text: '#8B949E' },
}

export default function Pill({ children, color = 'green', style }) {
  const c = colorMap[color] || colorMap.green
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
      background: c.bg,
      color: c.text,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  )
}
