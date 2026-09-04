import { motion } from 'framer-motion'

const reveal = {
  hidden: { y: '100%' },
  show: { y: 0 },
}

export default function Hero() {
  return (
    <section
      style={{
        padding: 'clamp(56px, 10vh, 96px) clamp(24px, 5vw, 56px) clamp(48px, 8vh, 72px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ overflow: 'hidden', marginBottom: 18 }}>
        <motion.span
          className="mono"
          variants={reveal}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-2)', letterSpacing: '0.04em' }}
        >
          [ status: open to work ]
        </motion.span>
      </div>

      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          variants={reveal}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.9rem)',
            lineHeight: 1.35,
            fontWeight: 700,
            letterSpacing: '-0.015em',
            maxWidth: 760,
            color: 'var(--white)',
          }}
        >
          I build small, focused tools — Android apps with Material You,
          terminal utilities, and the occasional website.
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{ display: 'flex', gap: 28, marginTop: 32 }}
      >
        <a
          className="link"
          href="#projects"
          onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
          style={{ fontSize: '0.95rem', color: 'var(--white)' }}
        >
          view work →
        </a>
        <a
          className="link"
          href="#contact"
          onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
          style={{ fontSize: '0.95rem', color: 'var(--muted)' }}
        >
          get in touch →
        </a>
      </motion.div>
    </section>
  )
}
