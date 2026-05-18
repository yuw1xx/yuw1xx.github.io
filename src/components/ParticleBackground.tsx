import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 120
const DEPTH = 400

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 1, 2000)
    camera.position.z = 500

    // Particles
    const positions: number[] = []
    const velocities: THREE.Vector3[] = []
    const colors: number[] = []
    const purple = new THREE.Color('#8b5cf6')
    const red = new THREE.Color('#ef4444')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * mount.clientWidth * 1.5,
        (Math.random() - 0.5) * mount.clientHeight * 1.5,
        (Math.random() - 0.5) * DEPTH,
      )
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.1,
        ),
      )
      const t = Math.random()
      const c = purple.clone().lerp(red, t)
      colors.push(c.r, c.g, c.b)
    }

    const geo = new THREE.BufferGeometry()
    const posAttr = new THREE.Float32BufferAttribute(positions, 3)
    const colAttr = new THREE.Float32BufferAttribute(colors, 3)
    geo.setAttribute('position', posAttr)
    geo.setAttribute('color', colAttr)

    const mat = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Lines between close particles
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
    })
    const lineGeo = new THREE.BufferGeometry()
    const linePoints: number[] = []
    const lineColors: number[] = []
    const lineRef = { geo: lineGeo }
    const lineObj = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineObj)

    // Mouse parallax
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      const pos = posAttr.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3] += velocities[i].x
        pos[i * 3 + 1] += velocities[i].y
        pos[i * 3 + 2] += velocities[i].z

        // Wrap around bounds
        const hw = mount.clientWidth * 0.75
        const hh = mount.clientHeight * 0.75
        if (pos[i * 3] > hw) pos[i * 3] = -hw
        if (pos[i * 3] < -hw) pos[i * 3] = hw
        if (pos[i * 3 + 1] > hh) pos[i * 3 + 1] = -hh
        if (pos[i * 3 + 1] < -hh) pos[i * 3 + 1] = hh
        if (Math.abs(pos[i * 3 + 2]) > DEPTH / 2) velocities[i].z *= -1
      }
      posAttr.needsUpdate = true

      // Rebuild connection lines
      linePoints.length = 0
      lineColors.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = pos[i * 3] - pos[j * 3]
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < CONNECTION_DISTANCE) {
            linePoints.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
            linePoints.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2])
            const alpha = 1 - dist / CONNECTION_DISTANCE
            const ci = colors.slice(i * 3, i * 3 + 3)
            const cj = colors.slice(j * 3, j * 3 + 3)
            lineColors.push(ci[0] * alpha, ci[1] * alpha, ci[2] * alpha)
            lineColors.push(cj[0] * alpha, cj[1] * alpha, cj[2] * alpha)
          }
        }
      }

      lineRef.geo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3))
      lineRef.geo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))

      // Subtle camera parallax from mouse
      camera.position.x += (mouseX * 30 - camera.position.x) * 0.03
      camera.position.y += (-mouseY * 30 - camera.position.y) * 0.03
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
