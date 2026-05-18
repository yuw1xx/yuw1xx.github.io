export default function GradientBlobs() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Top-left purple blob */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'blob-1 18s ease-in-out infinite',
        }}
      />
      {/* Bottom-right red blob */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(185,28,28,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'blob-2 22s ease-in-out infinite',
        }}
      />
      {/* Center accent blob */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '40%',
          width: '30vw',
          height: '30vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-3 14s ease-in-out infinite',
        }}
      />
    </div>
  )
}
