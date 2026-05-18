import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ── Symbol scramble ─────────────────────────────────────────────────────── */
const SYMBOLS = '!@#$%&*?|^~<>[]{}+=§ø¶∆©®™∞≈çÑ'

function randomChar() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}

function useScramble(target: string, startDelay = 200) {
  const [display, setDisplay] = useState(() => target.split('').map(randomChar).join(''))

  useEffect(() => {
    const letters = target.split('').map(randomChar)
    const settled = new Array(target.length).fill(false)

    // Global scramble ticker — updates all unsettled chars every 45ms
    const interval = setInterval(() => {
      for (let i = 0; i < letters.length; i++) {
        if (!settled[i]) letters[i] = randomChar()
      }
      setDisplay(letters.join(''))
    }, 45)

    // Settle each character left-to-right with stagger
    const timeouts: ReturnType<typeof setTimeout>[] = []
    target.split('').forEach((char, i) => {
      const t = setTimeout(() => {
        settled[i] = true
        letters[i] = char
        setDisplay(letters.join(''))
        if (settled.every(Boolean)) clearInterval(interval)
      }, startDelay + i * 110)
      timeouts.push(t)
    })

    return () => {
      clearInterval(interval)
      timeouts.forEach(clearTimeout)
    }
  }, [target, startDelay])

  return display
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const name = useScramble('yuwixx', 300)

  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 700], [0, -180])
  const opacity = useTransform(scrollY, [0, 450], [1, 0])
  const scale   = useTransform(scrollY, [0, 600], [1, 0.92])

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
      }}
    >
      <motion.div style={{ y, opacity, scale }}>
        {/* Scrambled name — M3 Display */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(4rem, 13vw, 9.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            marginBottom: 52,
            background: 'linear-gradient(120deg, #EDE9FE 0%, #C084FC 35%, #F87171 65%, #EDE9FE 100%)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 6s linear infinite',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {name}
        </motion.h1>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <PillButton
            variant="filled"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            view projects
          </PillButton>
          <PillButton
            variant="outlined"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            get in touch
          </PillButton>
        </motion.div>
      </motion.div>

      {/* Scroll hint — appears after scramble settles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          color: 'var(--on-surface-muted)',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          animation: 'bounce-y 2.4s ease-in-out infinite',
        }}
      >
        scroll
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  )
}

/* ── Shared button ───────────────────────────────────────────────────────── */
function PillButton({ children, variant, onClick }: {
  children: React.ReactNode
  variant: 'filled' | 'outlined'
  onClick?: () => void
}) {
  const filled = variant === 'filled'
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        padding: '11px 28px',
        borderRadius: 24,
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        border: filled ? 'none' : '1px solid rgba(192,132,252,0.35)',
        background: filled ? 'linear-gradient(135deg, #7C3AED, #C084FC)' : 'rgba(192,132,252,0.06)',
        color: filled ? '#fff' : 'var(--primary)',
        backdropFilter: !filled ? 'blur(8px)' : undefined,
        transition: 'background 0.2s',
        boxShadow: filled ? '0 0 24px rgba(124,58,237,0.4)' : 'none',
      }}
    >
      {children}
    </motion.button>
  )
}
