import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { SectionLabel } from './About'

interface Project {
  name: string
  headline: string        /* M3 title-large */
  desc: string            /* M3 body-medium */
  tags: string[]
  repo: string
  accent: string
  accentDim: string
}

const PROJECTS: Project[] = [
  {
    name: 'resonance',
    headline: 'Material You music player',
    desc: 'Android 15+ music player with adaptive colors pulled from your wallpaper. Fully open source and FOSS.',
    tags: ['Kotlin', 'Android', 'Material You', 'FOSS'],
    repo: 'https://github.com/yuw1xx/resonance',
    accent: '#C084FC',
    accentDim: 'rgba(192,132,252,',
  },
  {
    name: 'lamp',
    headline: 'Terminal LAMP stack manager',
    desc: 'Interactive TUI to spin up Apache, MySQL, and PHP on Linux in seconds. Universal and zero-config.',
    tags: ['Shell', 'Linux', 'Apache', 'MySQL'],
    repo: 'https://github.com/yuw1xx/lamp',
    accent: '#F87171',
    accentDim: 'rgba(248,113,113,',
  },
]

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="projects" ref={ref}
      style={{ padding: '120px 24px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}
    >
      <motion.div style={{ y, maxWidth: 720, width: '100%' }}>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <SectionLabel index="03" text="projects" />
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
          }}>
            things i&apos;ve <span style={{ color: 'var(--primary-dim)' }}>built</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-muted)', marginBottom: 32, letterSpacing: '0.02em' }}>
            open source work
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROJECTS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = (e.clientX - rect.left) / rect.width
    const cy = (e.clientY - rect.top)  / rect.height
    setTilt({ rx: (cy - 0.5) * -10, ry: (cx - 0.5) * 10 })
  }

  return (
    <motion.div ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ rx: 0, ry: 0 }); setHovered(false) }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{ perspective: 900, transformStyle: 'preserve-3d' }}
    >
      {/* M3 Filled card — surface-container, extra-large shape (28dp) */}
      <div style={{
        background: hovered ? 'var(--sc-high)' : 'var(--sc)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? project.accentDim + '0.28)' : 'var(--outline-var)'}`,
        borderRadius: 28,
        overflow: 'hidden',
        transition: 'background 0.22s, border-color 0.22s, box-shadow 0.22s',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.45), 0 0 28px ${project.accentDim}0.12)` : 'none',
      }}>

        {/* M3 Tonal accent strip — top of card */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${project.accent}, transparent)`,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.22s',
        }} />

        <div style={{ padding: '24px 28px 28px' }}>
          {/* M3 Card header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            {/* M3 Label Large — project id */}
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>
              {project.name}
            </span>
            {/* M3 Text button */}
            <motion.a href={project.repo} target="_blank" rel="noreferrer"
              whileHover={{ color: project.accent }}
              style={{
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em',
                color: 'var(--on-surface-muted)',
                padding: '4px 10px',
                borderRadius: 8,
                background: hovered ? `${project.accentDim}0.08)` : 'transparent',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              repo ↗
            </motion.a>
          </div>

          {/* M3 Title Large — 22sp */}
          <h3 style={{
            fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em',
            color: project.accent, marginBottom: 10, lineHeight: 1.3,
          }}>
            {project.headline}
          </h3>

          {/* M3 Body Medium — 14sp */}
          <p style={{ fontSize: '0.88rem', color: 'var(--on-surface-var)', lineHeight: 1.75, marginBottom: 20 }}>
            {project.desc}
          </p>

          {/* M3 Suggestion chips — surface-container-highest, extra-small shape (4dp) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                display: 'inline-flex', alignItems: 'center', height: 28,
                padding: '0 12px',
                background: `${project.accentDim}0.10)`,
                border: `1px solid ${project.accentDim}0.22)`,
                borderRadius: 6,                       /* M3 extra-small shape */
                fontSize: '0.72rem', fontWeight: 600,
                color: project.accent, letterSpacing: '0.04em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
