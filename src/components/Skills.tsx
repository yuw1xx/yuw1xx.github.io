import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from './SectionLabel'
import GithubLanguages from './GithubLanguages'

const STACK = [
  'Android', 'Kotlin', 'Material You', 'TypeScript', 'React',
  'Node.js', 'Shell', 'Linux', 'Git', 'Vite', 'FOSS',
]

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" ref={ref} style={{ padding: 'clamp(48px, 8vh, 80px) clamp(24px, 5vw, 56px)', borderTop: '1px solid var(--border)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        <SectionLabel index="02" text="skills" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
        style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', lineHeight: 1.7, maxWidth: 640, color: 'var(--gray-1)' }}
      >
        {STACK.map((label, i) => (
          <span key={label}>
            <span style={{ color: 'var(--white)' }}>{label}</span>
            {i < STACK.length - 1 && <span style={{ color: 'var(--gray-3)' }}> / </span>}
          </span>
        ))}
      </motion.p>

      <GithubLanguages />
    </section>
  )
}
