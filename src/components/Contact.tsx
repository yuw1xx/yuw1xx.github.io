import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import SectionLabel from './SectionLabel'

const EMAIL = 'yuwixx@yuwixx.dev'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" ref={ref} style={{ padding: 'clamp(48px, 8vh, 80px) clamp(24px, 5vw, 56px) clamp(64px, 10vh, 100px)', borderTop: '1px solid var(--border)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        <SectionLabel index="04" text="contact" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
        style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: 20 }}
      >
        Open to collabs and new opportunities. Say hello —
      </motion.p>

      <motion.button
        onClick={copy}
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
        style={{
          display: 'block', background: 'none', border: 'none', cursor: 'pointer',
          padding: 0, textAlign: 'left', position: 'relative',
        }}
      >
        <span style={{
          fontSize: 'clamp(1.8rem, 6vw, 3.4rem)', fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--white)',
          wordBreak: 'break-word',
        }}>
          {EMAIL}
        </span>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mono"
              style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-2)', marginTop: 12 }}
            >
              copied to clipboard
            </motion.span>
          )}
        </AnimatePresence>
        {!copied && (
          <span className="mono" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-3)', marginTop: 12 }}>
            click to copy
          </span>
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: 48, display: 'flex', gap: 28 }}
      >
        <a className="link" href="https://github.com/yuw1xx" target="_blank" rel="noreferrer"
          style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>
          github ↗
        </a>
        <a className="link" href="https://mastodon.social/@yuwixx" target="_blank" rel="noreferrer"
          style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>
          mastodon ↗
        </a>
      </motion.div>
    </section>
  )
}
