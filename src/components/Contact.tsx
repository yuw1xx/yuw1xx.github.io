import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { SectionLabel } from './About'

interface Social {
  id: string
  label: string
  supporting: string      /* M3 supporting text */
  handle: string
  href?: string
  copyable?: boolean
  accent: string
  accentDim: string
}

const SOCIALS: Social[] = [
  {
    id: 'gh', label: 'GitHub', supporting: 'source code & open source',
    handle: '@yuw1xx', href: 'https://github.com/yuw1xx',
    accent: '#C084FC', accentDim: 'rgba(192,132,252,',
  },
  {
    id: 'dc', label: 'Discord', supporting: 'tap to copy username',
    handle: '_ywx1', copyable: true,
    accent: '#F87171', accentDim: 'rgba(248,113,113,',
  },
]

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="contact" ref={ref}
      style={{ padding: '120px 24px 160px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}
    >
      <motion.div style={{ y, maxWidth: 720, width: '100%' }}>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <SectionLabel index="04" text="contact" />
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
          }}>
            let&apos;s <span style={{ color: 'var(--primary-dim)' }}>connect</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-muted)', marginBottom: 32, letterSpacing: '0.02em' }}>
            open to collabs and new opportunities
          </p>
        </motion.div>

        {/* M3 Divider */}
        <div style={{ height: 1, background: 'var(--outline-var)', marginBottom: 24 }} />

        {/* M3 List — surface-container card wrapping the tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--sc)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--outline-var)',
            borderRadius: 28,               /* M3 extra-large shape */
            overflow: 'hidden',
          }}
        >
          {SOCIALS.map((s, i) => (
            <div key={s.id}>
              <SocialTile social={s} index={i} inView={inView} />
              {/* M3 Divider between list items */}
              {i < SOCIALS.length - 1 && (
                <div style={{ height: 1, background: 'var(--outline-var)', margin: '0 20px' }} />
              )}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            marginTop: 80, textAlign: 'center',
            fontSize: '0.65rem', color: 'var(--on-surface-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}
        >
          built with react · framer motion · deployed on vercel
        </motion.p>
      </motion.div>
    </section>
  )
}

function SocialTile({ social }: { social: Social; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 })
  const [copied, setCopied]   = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = (e.clientX - rect.left) / rect.width
    const cy = (e.clientY - rect.top)  / rect.height
    setTilt({ rx: (cy - 0.5) * -5, ry: (cx - 0.5) * 5 })
  }

  const handleClick = () => {
    if (!social.copyable) return
    navigator.clipboard.writeText(social.handle)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  /* M3 two-line list tile — min-height 72dp */
  const tileContent = (
    <motion.div ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ rx: 0, ry: 0 }) }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      style={{
        perspective: 600,
        display: 'flex', alignItems: 'center', gap: 16,
        minHeight: 72,                              /* M3 two-line list tile */
        padding: '12px 24px',
        background: hovered ? 'rgba(192,132,252,0.05)' : 'transparent',
        transition: 'background 0.18s',
        cursor: 'pointer',
      }}
    >
      {/* Leading — M3 tonal icon container 40dp */}
      <div style={{
        width: 40, height: 40, borderRadius: 12,   /* medium shape */
        background: `${social.accentDim}0.15)`,
        border: `1px solid ${social.accentDim}0.25)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'background 0.18s',
      }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: social.accent, letterSpacing: '0.04em' }}>
          {social.id.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* M3 Title Medium — 16sp, 500 */}
        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: 3, letterSpacing: '0.01em' }}>
          {social.label}
        </div>
        {/* M3 Body Medium — 14sp, supporting text */}
        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-muted)', letterSpacing: '0.01em' }}>
          {social.supporting}
        </div>
      </div>

      {/* Trailing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* M3 Label Large — handle */}
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: social.accent }}>
          {social.handle}
        </span>
        <AnimatePresence mode="wait">
          {social.copyable ? (
            copied ? (
              <motion.span key="ok"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{
                  fontSize: '0.65rem', fontWeight: 700,
                  background: `${social.accentDim}0.15)`,
                  color: social.accent,
                  border: `1px solid ${social.accentDim}0.3)`,
                  borderRadius: 6, padding: '3px 10px', letterSpacing: '0.06em',
                }}
              >
                copied!
              </motion.span>
            ) : (
              <motion.span key="copy" style={{ fontSize: '0.72rem', color: 'var(--on-surface-muted)' }}>copy</motion.span>
            )
          ) : (
            <span style={{ color: 'var(--on-surface-muted)', fontSize: '0.85rem' }}>↗</span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )

  return social.href
    ? <a href={social.href} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>{tileContent}</a>
    : <div onClick={handleClick}>{tileContent}</div>
}
