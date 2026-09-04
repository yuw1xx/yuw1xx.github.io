import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { fetchRepos } from '../lib/github'

interface Lang { name: string; pct: number }

async function computeLangs(): Promise<Lang[]> {
  const repos = await fetchRepos()
  const totals: Record<string, number> = {}
  await Promise.all(repos.map(async r => {
    try {
      const lr = await fetch(`https://api.github.com/repos/yuw1xx/${r.name}/languages`)
      if (!lr.ok) return
      const langs: Record<string, number> = await lr.json()
      for (const [l, b] of Object.entries(langs)) totals[l] = (totals[l] ?? 0) + b
    } catch { /* skip */ }
  }))
  const total = Object.values(totals).reduce((a, b) => a + b, 0)
  if (!total) return []
  return Object.entries(totals).sort(([, a], [, b]) => b - a).slice(0, 6)
    .map(([name, bytes]) => ({ name, pct: Math.round((bytes / total) * 1000) / 10 }))
}

export default function GithubLanguages() {
  const [langs, setLangs] = useState<Lang[]>([])
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    computeLangs().then(d => { setLangs(d); setStatus('done') }).catch(() => setStatus('error'))
  }, [])

  return (
    <div ref={ref} style={{ marginTop: 56 }}>
      <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--gray-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
        languages — across public repos
      </div>

      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 1, background: 'var(--border)' }} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <p className="mono" style={{ color: 'var(--dim)', fontSize: '0.9rem' }}>// github api unreachable</p>
      )}

      {status === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {langs.map((l, i) => (
            <motion.div key={l.name}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.95rem', color: 'var(--white)' }}>{l.name}</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--gray-2)' }}>{l.pct}%</span>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${l.pct}%` } : {}}
                  transition={{ duration: 0.8, delay: i * 0.06 + 0.1, ease: 'easeOut' }}
                  style={{ height: 2, marginTop: -0.5, background: 'var(--white)' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
