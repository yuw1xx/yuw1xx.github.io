import { useEffect, useRef } from 'react'

/* ─── Shape definitions ────────────────────────────────────────────────── */
interface ShapeDef {
  id: number
  kind: 'circle' | 'squircle' | 'pill' | 'ring' | 'dot' | 'arc'
  baseX: number   // % from left
  baseY: number   // % from top
  w: number       // px
  h: number       // px
  rot: number     // base rotation deg
  color: string
  stroke: boolean
  strokeW: number
  opacity: number
  mouseStr: number   // mouse parallax strength (neg = repel)
  scrollMul: number  // scroll parallax multiplier
  morphAnim?: string
  morphDur?: string
}

const PURPLE_STROKE = 'rgba(192, 132, 252, VAL)'
const RED_STROKE    = 'rgba(248, 113, 113, VAL)'
const PURPLE_FILL   = 'rgba(124, 77, 255, VAL)'
const RED_FILL      = 'rgba(239, 68, 68, VAL)'

const c = (template: string, alpha: number) => template.replace('VAL', String(alpha))

const SHAPES: ShapeDef[] = [
  // ── Large circle ring — top-left ───────────────────────
  {
    id: 0, kind: 'ring', baseX: 6, baseY: 14, w: 360, h: 360, rot: 0,
    color: c(PURPLE_STROKE, 0.22), stroke: true, strokeW: 1.5, opacity: 1,
    mouseStr: 0.04, scrollMul: 0.14,
  },
  // ── Squircle filled — top-right ────────────────────────
  {
    id: 1, kind: 'squircle', baseX: 84, baseY: 10, w: 200, h: 200, rot: 18,
    color: c(PURPLE_FILL, 0.10), stroke: false, strokeW: 0, opacity: 1,
    mouseStr: -0.07, scrollMul: 0.25,
    morphAnim: 'morph-b', morphDur: '16s',
  },
  // ── Pill outline — bottom-left ─────────────────────────
  {
    id: 2, kind: 'pill', baseX: 4, baseY: 80, w: 220, h: 76, rot: -22,
    color: c(RED_STROKE, 0.20), stroke: true, strokeW: 1.2, opacity: 1,
    mouseStr: 0.09, scrollMul: 0.38,
  },
  // ── Small filled circle — mid-right ────────────────────
  {
    id: 3, kind: 'circle', baseX: 92, baseY: 52, w: 88, h: 88, rot: 0,
    color: c(RED_FILL, 0.18), stroke: false, strokeW: 0, opacity: 1,
    mouseStr: -0.12, scrollMul: 0.20,
  },
  // ── Large squircle ring — bottom-right ─────────────────
  {
    id: 4, kind: 'squircle', baseX: 82, baseY: 84, w: 300, h: 300, rot: -12,
    color: c(PURPLE_STROKE, 0.16), stroke: true, strokeW: 1, opacity: 1,
    mouseStr: 0.05, scrollMul: 0.30,
    morphAnim: 'morph-c', morphDur: '22s',
  },
  // ── Medium ring — centre ───────────────────────────────
  {
    id: 5, kind: 'ring', baseX: 50, baseY: 32, w: 140, h: 140, rot: 0,
    color: c(RED_STROKE, 0.12), stroke: true, strokeW: 1, opacity: 1,
    mouseStr: 0.08, scrollMul: 0.16,
  },
  // ── Pill filled — top-centre-left ──────────────────────
  {
    id: 6, kind: 'pill', baseX: 28, baseY: 6, w: 160, h: 56, rot: 8,
    color: c(PURPLE_FILL, 0.08), stroke: false, strokeW: 0, opacity: 1,
    mouseStr: -0.05, scrollMul: 0.12,
  },
  // ── Arc / partial ring — right ─────────────────────────
  {
    id: 7, kind: 'arc', baseX: 96, baseY: 32, w: 200, h: 200, rot: 30,
    color: c(PURPLE_STROKE, 0.18), stroke: true, strokeW: 1.5, opacity: 1,
    mouseStr: -0.06, scrollMul: 0.22,
  },
  // ── Dots ───────────────────────────────────────────────
  { id: 8,  kind: 'dot', baseX: 22, baseY: 62, w: 10, h: 10, rot: 0, color: c(PURPLE_FILL, 0.55), stroke: false, strokeW: 0, opacity: 1, mouseStr: 0.18, scrollMul: 0.45 },
  { id: 9,  kind: 'dot', baseX: 68, baseY: 26, w: 7,  h: 7,  rot: 0, color: c(RED_FILL,    0.60), stroke: false, strokeW: 0, opacity: 1, mouseStr: -0.14, scrollMul: 0.32 },
  { id: 10, kind: 'dot', baseX: 14, baseY: 44, w: 12, h: 12, rot: 0, color: c(PURPLE_FILL, 0.45), stroke: false, strokeW: 0, opacity: 1, mouseStr: 0.20,  scrollMul: 0.50 },
  { id: 11, kind: 'dot', baseX: 58, baseY: 88, w: 8,  h: 8,  rot: 0, color: c(RED_FILL,    0.50), stroke: false, strokeW: 0, opacity: 1, mouseStr: -0.10, scrollMul: 0.40 },
  { id: 12, kind: 'dot', baseX: 36, baseY: 18, w: 6,  h: 6,  rot: 0, color: c(PURPLE_FILL, 0.50), stroke: false, strokeW: 0, opacity: 1, mouseStr: 0.12,  scrollMul: 0.28 },
]

/* ─── Border-radius strings for each shape kind ───────────────────────── */
function borderRadius(kind: ShapeDef['kind']): string {
  switch (kind) {
    case 'circle':   return '50%'
    case 'ring':     return '50%'
    case 'dot':      return '50%'
    case 'squircle': return '40% 60% 55% 45% / 45% 55% 60% 40%'
    case 'pill':     return '999px'
    case 'arc':      return '50%'
  }
}

/* ─── Arc mask (hides 3/4 of a ring so it looks like an arc) ──────────── */
function clipPath(kind: ShapeDef['kind']): string | undefined {
  if (kind === 'arc') return 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)'
  return undefined
}

export default function Shapes() {
  const refs       = useRef<(HTMLDivElement | null)[]>([])
  const mouse      = useRef({ x: 50, y: 50 })
  const smoothMouse = useRef({ x: 50, y: 50 })
  const pos        = useRef(SHAPES.map(s => ({ x: s.baseX, y: s.baseY })))
  const scrollY    = useRef(0)
  const rafId      = useRef(0)

  useEffect(() => {
    const onMouse  = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 100
      mouse.current.y = (e.clientY / window.innerHeight) * 100
    }
    const onTouch  = (e: TouchEvent) => {
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
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.04
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.04

      SHAPES.forEach((shape, i) => {
        const el = refs.current[i]
        if (!el) return

        const mx = (smoothMouse.current.x - 50) * shape.mouseStr
        const my = (smoothMouse.current.y - 50) * shape.mouseStr
        const scrollPx = (scrollY.current * shape.scrollMul / window.innerHeight) * 100

        // Subtle drift for dots / small shapes
        const drift = shape.kind === 'dot'
          ? Math.sin(t * 0.0008 * (shape.id + 1) + shape.id) * 1.5
          : 0

        const targetX = shape.baseX + mx + drift
        const targetY = shape.baseY + my - scrollPx

        const lerpSpeed = shape.kind === 'dot' ? 0.03 : 0.015
        pos.current[i].x += (targetX - pos.current[i].x) * lerpSpeed
        pos.current[i].y += (targetY - pos.current[i].y) * lerpSpeed

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
      {SHAPES.map((shape, i) => (
        <div
          key={shape.id}
          ref={el => { refs.current[i] = el }}
          style={{
            position: 'absolute',
            left:      `${shape.baseX}%`,
            top:       `${shape.baseY}%`,
            width:     `${shape.w}px`,
            height:    `${shape.h}px`,
            transform: `translate(-50%, -50%) rotate(${shape.rot}deg)`,
            borderRadius: borderRadius(shape.kind),
            background: shape.stroke ? 'transparent' : shape.color,
            border:     shape.stroke ? `${shape.strokeW}px solid ${shape.color}` : 'none',
            opacity:    shape.opacity,
            clipPath:   clipPath(shape.kind),
            willChange: 'left, top',
            // CSS morph animation for squircles
            animation: shape.morphAnim
              ? `${shape.morphAnim} ${shape.morphDur} ease-in-out infinite`
              : undefined,
          }}
        />
      ))}
    </div>
  )
}
