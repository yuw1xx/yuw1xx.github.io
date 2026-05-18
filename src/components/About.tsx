import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const INFO = [
  { label: 'base',   value: 'Earth' },
  { label: 'focus',  value: 'full-stack' },
  { label: 'status', value: 'open to work' },
  { label: 'mood',   value: 'building' },
]

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="about" ref={ref}
      style={{ padding: '120px 24px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}
    >
      <motion.div style={{ y, maxWidth: 720, width: '100%' }}>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <SectionLabel index="01" text="about" />
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
            color: 'var(--on-surface)',
          }}>
            a bit about <span style={{ color: 'var(--primary-dim)' }}>me</span>
          </h2>
          {/* M3 supporting text */}
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-muted)', marginBottom: 32, letterSpacing: '0.02em' }}>
            developer · open source · android
          </p>
        </motion.div>

        {/* M3 Filled Card — surface-container, extra-large shape (28dp) */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--sc)',
            backdropFilter: 'blur(24px)',
            borderRadius: 28,
            padding: '28px 32px',
            marginBottom: 12,
            border: '1px solid var(--outline-var)',
          }}
        >
          {/* M3 Body Large */}
          <p style={{ color: 'var(--on-surface-var)', fontSize: '1rem', lineHeight: 1.85, letterSpacing: '0.01em' }}>
            I&apos;m a developer obsessed with design and craft — from Android apps with Material You
            to CLI tools and open-source projects. I care about the details that make software feel right.
          </p>
        </motion.div>

        {/* M3 Assist Chips — surface-container-high, small shape (8dp) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 8 }}
        >
          {INFO.map(({ label, value }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, scale: 0.94 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: i * 0.06 + 0.28 }}
              style={{
                background: 'var(--sc-high)',
                border: '1px solid var(--outline)',
                backdropFilter: 'blur(16px)',
                borderRadius: 16,          /* M3 medium shape */
                padding: '16px 20px',
              }}
            >
              {/* M3 Label Medium */}
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
              </div>
              {/* M3 Body Medium */}
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--on-surface)', letterSpacing: '0.01em' }}>
                {value}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  )
}

/* ── Shared SectionLabel ──────────────────────────────────────────────────── */
export function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--on-surface-muted)', letterSpacing: '0.12em' }}>
        {index}
      </span>
      {/* M3 Assist chip */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', height: 32,
        padding: '0 16px', gap: 8,
        background: 'rgba(248,113,113,0.10)',
        border: '1px solid rgba(248,113,113,0.22)',
        borderRadius: 8,              /* M3 small shape */
        fontSize: '0.68rem', fontWeight: 700,
        color: 'var(--tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        {/* M3 chip leading icon — small dot */}
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tertiary)', opacity: 0.7, flexShrink: 0 }} />
        {text}
      </span>
    </div>
  )
}
