import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { id: 'info',     label: 'info',     index: '01' },
  { id: 'skills',   label: 'skills',   index: '02' },
  { id: 'projects', label: 'projects', index: '03' },
  { id: 'contact',  label: 'contact',  index: '04' },
]

export default function Sidebar() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      for (let i = LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(LINKS[i].id)
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActive(LINKS[i].id)
          return
        }
      }
      setActive('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <aside className="rail">
      <div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', padding: 0, marginBottom: 10, color: 'var(--white)' }}
        >
          <h1 style={{ fontSize: '1.6rem' }}>yuwixx</h1>
        </button>
        <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--gray-2)', letterSpacing: '0.02em', marginBottom: 40, maxWidth: 240 }}>
          developer — Android, open source, and terminal tools
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '9px 0', textAlign: 'left', width: 'fit-content',
              }}
            >
              <span className="mono" style={{ fontSize: '0.75rem', color: active === link.id ? 'var(--white)' : 'var(--gray-3)', transition: 'color 0.2s' }}>
                {link.index}
              </span>
              <span style={{
                position: 'relative',
                fontSize: '0.95rem', fontWeight: active === link.id ? 600 : 400,
                color: active === link.id ? 'var(--white)' : 'var(--muted)',
                transition: 'color 0.2s',
              }}>
                {link.label}
                {active === link.id && (
                  <motion.span
                    layoutId="rail-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    style={{ position: 'absolute', left: 0, right: 0, bottom: -4, height: 1, background: 'var(--white)' }}
                  />
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <a className="link mono" href="https://github.com/yuw1xx" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.85rem', color: 'var(--muted)', width: 'fit-content' }}>
            github ↗
          </a>
          <a className="link mono" href="mailto:yuwixx@yuwixx.dev"
            style={{ fontSize: '0.85rem', color: 'var(--muted)', width: 'fit-content' }}>
            email ↗
          </a>
        </div>
        <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--dim)' }}>
          © 2026 — built with react
        </p>
      </div>
    </aside>
  )
}
