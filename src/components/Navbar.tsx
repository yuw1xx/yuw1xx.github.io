import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { id: 'about',    label: 'about' },
  { id: 'skills',   label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'contact',  label: 'contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      for (let i = LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(LINKS[i].id)
        if (el && window.scrollY >= el.offsetTop - 220) {
          setActive(LINKS[i].id)
          return
        }
      }
      setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      {/* Centering wrapper — never transformed by Framer Motion */}
      <div style={{
        position: 'fixed',
        top: 14,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 8px',
          borderRadius: 32,
          background: scrolled
            ? 'rgba(17,8,32,0.88)'
            : 'rgba(17,8,32,0.55)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(192,132,252,0.14)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
          transition: 'background 0.3s, box-shadow 0.3s',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: 'linear-gradient(135deg, #4B1094, #7C3AED)',
            border: 'none',
            borderRadius: 22,
            padding: '8px 18px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#EDE9FE',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            marginRight: 4,
            boxShadow: '0 0 16px rgba(124,58,237,0.3)',
          }}
        >
          yuwixx
        </button>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 2 }}>
          {LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              style={{
                position: 'relative',
                background: active === link.id ? 'rgba(192,132,252,0.14)' : 'transparent',
                border: 'none',
                borderRadius: 22,
                padding: '8px 16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: active === link.id ? 'var(--primary)' : 'var(--on-surface-var)',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'background 0.18s, color 0.18s',
              }}
              onMouseEnter={e => {
                if (active !== link.id)
                  (e.currentTarget as HTMLElement).style.background = 'rgba(192,132,252,0.08)'
              }}
              onMouseLeave={e => {
                if (active !== link.id)
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setOpen(v => !v)}
          aria-label="menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 10px',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={
                open
                  ? i === 0 ? { rotate: 45, y: 7 }
                  : i === 1 ? { opacity: 0 }
                  : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              style={{
                display: 'block', width: 20, height: 2,
                background: 'var(--primary)', borderRadius: 1,
              }}
            />
          ))}
        </button>
      </motion.nav>
      </div>

      {/* Mobile menu — also in a centering wrapper */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              top: 72,
              left: '50%',
              x: '-50%',
              zIndex: 199,
              background: 'rgba(17,8,32,0.96)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(192,132,252,0.14)',
              borderRadius: 24,
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 180,
            }}
          >
            {LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                style={{
                  background: active === link.id ? 'rgba(192,132,252,0.14)' : 'transparent',
                  border: 'none',
                  borderRadius: 16,
                  padding: '12px 20px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: active === link.id ? 'var(--primary)' : 'var(--on-surface-var)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  letterSpacing: '0.03em',
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
