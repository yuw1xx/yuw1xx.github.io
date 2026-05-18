import { useEffect, useRef } from 'react'

interface Blob {
  baseX: number        // % from left
  baseY: number        // % from top
  w: number            // vw
  h: number            // vw
  color: string
  blur: number
  morph: string
  morphDur: string
  mouseStr: number     // mouse influence strength (neg = repel)
  scrollMul: number    // scroll Y multiplier (px per px scrolled)
}

const BLOBS: Blob[] = [
  {
    baseX: 18, baseY: 12,
    w: 140, h: 130,
    color: 'var(--blob-purple)',
    blur: 90,
    morph: 'morph-a', morphDur: '20s',
    mouseStr: 0.10,
    scrollMul: 0.22,
  },
  {
    baseX: 72, baseY: 55,
    w: 130, h: 120,
    color: 'var(--blob-red)',
    blur: 100,
    morph: 'morph-b', morphDur: '26s',
    mouseStr: -0.07,
    scrollMul: 0.38,
  },
  {
    baseX: 45, baseY: 78,
    w: 120, h: 110,
    color: 'var(--blob-violet)',
    blur: 80,
    morph: 'morph-c', morphDur: '18s',
    mouseStr: 0.14,
    scrollMul: 0.15,
  },
  {
    baseX: 88, baseY: 8,
    w: 110, h: 100,
    color: 'var(--blob-crimson)',
    blur: 110,
    morph: 'morph-d', morphDur: '30s',
    mouseStr: -0.04,
    scrollMul: 0.30,
  },
]

export default function ReactiveBackground() {
  const refs        = useRef<(HTMLDivElement | null)[]>([])
  const mouse       = useRef({ x: 50, y: 50 })
  const smoothMouse = useRef({ x: 50, y: 50 })
  const pos         = useRef(BLOBS.map(b => ({ x: b.baseX, y: b.baseY })))
  const scrollY     = useRef(0)
  const rafId       = useRef(0)

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 100
      mouse.current.y = (e.clientY / window.innerHeight) * 100
    }
    const onTouch = (e: TouchEvent) => {
      mouse.current.x = (e.touches[0].clientX / window.innerWidth)  * 100
      mouse.current.y = (e.touches[0].clientY / window.innerHeight) * 100
    }
    const onScroll = () => { scrollY.current = window.scrollY }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('scroll',    onScroll, { passive: true })

    let t = 0
    const tick = () => {
      t++

      // Lerp smooth mouse
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.032
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.032

      BLOBS.forEach((blob, i) => {
        const el = refs.current[i]
        if (!el) return

        // Organic drift (sine waves)
        const driftX = Math.sin(t * 0.00035 * (i + 1) + i * 1.7) * 9
        const driftY = Math.cos(t * 0.00028 * (i + 1) + i * 1.1) * 8

        // Mouse offset from screen center
        const mx = (smoothMouse.current.x - 50) * blob.mouseStr
        const my = (smoothMouse.current.y - 50) * blob.mouseStr

        // Scroll parallax: converts px scrolled → % of viewport height
        const scrollOffset = (scrollY.current * blob.scrollMul / window.innerHeight) * 100

        const targetX = blob.baseX + driftX + mx
        const targetY = blob.baseY + driftY + my - scrollOffset

        // Lerp position
        pos.current[i].x += (targetX - pos.current[i].x) * 0.012
        pos.current[i].y += (targetY - pos.current[i].y) * 0.012

        el.style.left = `${pos.current[i].x}%`
        el.style.top  = `${pos.current[i].y}%`
      })

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('scroll',    onScroll)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          ref={el => { refs.current[i] = el }}
          style={{
            position: 'absolute',
            left:   `${blob.baseX}%`,
            top:    `${blob.baseY}%`,
            width:  `${blob.w}vw`,
            height: `${blob.h}vw`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse at 38% 38%, ${blob.color} 0%, transparent 68%)`,
            filter: `blur(${blob.blur}px)`,
            animation: `${blob.morph} ${blob.morphDur} ease-in-out infinite`,
            willChange: 'left, top',
          }}
        />
      ))}

      {/* Deep vignette so content stays readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(8,0,16,0.72) 100%)',
      }} />

      {/* Bottom fade so sections blend cleanly */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '30vh',
        background: 'linear-gradient(to bottom, transparent, rgba(8,0,16,0.6))',
      }} />
    </div>
  )
}
