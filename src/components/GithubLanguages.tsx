import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const COLORS: Record<string, string> = {
  TypeScript: '#60A5FA', JavaScript: '#FBBF24', Kotlin: '#A855F7',
  Shell: '#4ADE80', HTML: '#F87171', CSS: '#8B5CF6',
  Python: '#60A5FA', Rust: '#FB923C', Go: '#22D3EE',
  Java: '#FBBF24', 'C++': '#EC4899', C: '#94A3B8',
}

interface Lang { name: string; bytes: number; color: string; pct: number }

async function fetchLangs(): Promise<Lang[]> {
  const res = await fetch('https://api.github.com/users/yuw1xx/repos?per_page=100')
  if (!res.ok) throw new Error()
  const repos: { name: string; fork: boolean }[] = await res.json()
  const totals: Record<string, number> = {}
  await Promise.all(repos.filter(r => !r.fork).map(async r => {
    try {
      const lr = await fetch(`https://api.github.com/repos/yuw1xx/${r.name}/languages`)
      if (!lr.ok) return
      const langs: Record<string, number> = await lr.json()
      for (const [l, b] of Object.entries(langs)) totals[l] = (totals[l] ?? 0) + b
    } catch { /* skip */ }
  }))
  const total = Object.values(totals).reduce((a, b) => a + b, 0)
  if (!total) return []
  return Object.entries(totals).sort(([, a], [, b]) => b - a).slice(0, 8)
    .map(([name, bytes]) => ({ name, bytes, color: COLORS[name] ?? '#94A3B8', pct: Math.round((bytes / total) * 1000) / 10 }))
}

export default function GithubLanguages() {
  const [langs, setLangs] = useState<Lang[]>([])
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    fetchLangs().then(d => { setLangs(d); setStatus('done') }).catch(() => setStatus('error'))
  }, [])

  return (
    <div ref={ref} style={{ paddingTop: 32 }}>
      {/* Header row — M3 Label Large + supporting info */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '0.04em' }}>
          GitHub languages
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--on-surface-muted)' }}>across all public repos</span>
      </div>

      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[72, 52, 32].map((w, i) => (
            <div key={i} style={{ height: 52, width: `${w}%`, borderRadius: 14, background: 'var(--sc)', opacity: 0.5 }} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.82rem' }}>{'// github api unreachable'}</p>
      )}

      {status === 'done' && (
        <>
          {/* Stacked colour bar — M3 Linear progress style */}
          <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', gap: 2, marginBottom: 20 }}>
            {langs.map((l, i) => (
              <motion.div key={l.name}
                initial={{ flex: 0 }} animate={inView ? { flex: l.pct } : {}}
                transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
                title={`${l.name} ${l.pct}%`}
                style={{ background: l.color, borderRadius: 2, minWidth: 0 }}
              />
            ))}
          </div>

          {/* M3 two-line list tiles — surface-container, 16dp shape */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {langs.map((l, i) => (
              <motion.div key={l.name}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.065 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  minHeight: 52,                         /* M3 two-line list tile */
                  padding: '0 20px',
                  background: 'var(--sc)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--outline-var)',
                  borderRadius: 16,                      /* M3 medium shape */
                }}
              >
                {/* Leading element — M3 icon container */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${l.color}1A`,
                  border: `1px solid ${l.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, boxShadow: `0 0 8px ${l.color}88` }} />
                </div>

                {/* Headline + supporting text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: 2 }}>{l.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-muted)' }}>{l.pct}% of total</div>
                </div>

                {/* Trailing — mini progress bar */}
                <div style={{ width: 80, height: 3, background: 'var(--outline-var)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${l.pct}%` } : {}}
                    transition={{ duration: 1, delay: i * 0.065 + 0.3, ease: 'easeOut' }}
                    style={{ height: '100%', background: l.color, borderRadius: 2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
