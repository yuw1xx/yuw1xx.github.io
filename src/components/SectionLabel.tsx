export default function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
      <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--gray-3)' }}>
        {index}
      </span>
      <span className="mono" style={{
        fontSize: '0.8rem',
        color: 'var(--gray-2)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        {text}
      </span>
      <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}
