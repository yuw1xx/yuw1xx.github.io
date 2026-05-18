import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { SectionLabel } from './About'
import GithubLanguages from './GithubLanguages'

const STACK = [
  { label: 'Android',      color: 'var(--primary-dim)' },
  { label: 'Kotlin',       color: '#A855F7' },
  { label: 'Material You', color: 'var(--primary-dim)' },
  { label: 'TypeScript',   color: '#60A5FA' },
  { label: 'React',        color: '#38BDF8' },
  { label: 'Node.js',      color: '#4ADE80' },
  { label: 'Shell',        color: '#A3E635' },
  { label: 'Linux',        color: 'var(--on-surface-var)' },
  { label: 'Git',          color: 'var(--tertiary)' },
  { label: 'Vite',         color: '#C084FC' },
  { label: 'Vercel',       color: 'var(--on-surface)' },
  { label: 'FOSS',         color: 'var(--tertiary)' },
]

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="skills" ref={ref}
      style={{ padding: '120px 24px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}
    >
      <motion.div style={{ y, maxWidth: 720, width: '100%' }}>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <SectionLabel index="02" text="skills" />
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
          }}>
            my <span style={{ color: 'var(--primary-dim)' }}>stack</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-muted)', marginBottom: 32, letterSpacing: '0.02em' }}>
            tools i reach for
          </p>
        </motion.div>

        {/* M3 Filter chips — height 32dp, small shape (8dp) */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          {STACK.map((tech, i) => (
            <motion.span key={tech.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.04 + 0.2 }}
              whileHover={{ background: 'var(--sc-highest)', borderColor: 'var(--outline)', scale: 1.04 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 34,
                padding: '0 16px',
                background: 'var(--sc-high)',
                border: '1px solid var(--outline-var)',
                backdropFilter: 'blur(16px)',
                borderRadius: 8,           /* M3 small shape */
                fontSize: '0.8rem', fontWeight: 500,
                color: 'var(--on-surface-var)',
                cursor: 'default',
                letterSpacing: '0.02em',
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
              }}
            >
              {/* Coloured leading dot — M3 chip icon slot */}
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: tech.color, flexShrink: 0, opacity: 0.8,
              }} />
              {tech.label}
            </motion.span>
          ))}
        </motion.div>

        {/* M3 Divider */}
        <div style={{ height: 1, background: 'var(--outline-var)', margin: '40px 0 0' }} />

        <GithubLanguages />

      </motion.div>
    </section>
  )
}
