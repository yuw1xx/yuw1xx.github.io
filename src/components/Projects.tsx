import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from './SectionLabel'
import { fetchRepos, type Repo } from '../lib/github'

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [repos, setRepos] = useState<Repo[]>([])
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')

  useEffect(() => {
    fetchRepos()
      .then(all => {
        const top = all
          .filter(r => r.description && r.name !== 'yuwixx' && r.name !== 'yuw1xx.github.io')
          .sort((a, b) =>
            b.stargazers_count - a.stargazers_count ||
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
          )
          .slice(0, 6)
        setRepos(top)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <section id="projects" ref={ref} style={{ padding: 'clamp(48px, 8vh, 80px) clamp(24px, 5vw, 56px)', borderTop: '1px solid var(--border)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        <SectionLabel index="03" text="projects" />
      </motion.div>

      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ height: 1, background: 'var(--border)' }} />)}
        </div>
      )}

      {status === 'error' && (
        <p className="mono" style={{ color: 'var(--dim)', fontSize: '0.9rem' }}>
          // github api unreachable — see github.com/yuw1xx
        </p>
      )}

      {status === 'done' && (
        <div>
          {repos.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
            >
              <ProjectRow repo={p} index={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}

function ProjectRow({ repo, index }: { repo: Repo; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={repo.html_url} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '40px 1fr auto',
        alignItems: 'baseline', gap: 20,
        padding: '22px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--gray-3)' }}>
        {String(index).padStart(2, '0')}
      </span>

      <div>
        <div style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 600,
          color: 'var(--white)', marginBottom: 6,
          textDecoration: hovered ? 'underline' : 'none',
          textUnderlineOffset: 4,
        }}>
          {repo.name}
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 520 }}>
          {repo.description}
        </p>
      </div>

      <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--gray-2)', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {repo.language && <div>{repo.language}</div>}
        <div style={{ color: 'var(--gray-3)' }}>★ {repo.stargazers_count}</div>
      </div>
    </a>
  )
}
