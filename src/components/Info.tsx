import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from './SectionLabel'

const INFO = [
  { label: 'base',   value: 'Earth' },
  { label: 'focus',  value: 'Full-stack' },
  { label: 'status', value: 'Open to work' },
  { label: 'stack',  value: 'See below' },
]

export default function Info() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="info" ref={ref} style={{ padding: 'clamp(48px, 8vh, 80px) clamp(24px, 5vw, 56px)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        <SectionLabel index="01" text="info" />
      </motion.div>

      <div>
        {INFO.map(({ label, value }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.06 + 0.1, ease: 'easeOut' }}
            style={{
              display: 'grid', gridTemplateColumns: '160px 1fr',
              padding: '18px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--gray-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {label}
            </span>
            <span style={{ fontSize: '1.05rem', color: 'var(--white)' }}>
              {value}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
