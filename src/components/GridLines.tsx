/* ── Faint structural guide-lines standing in for a visible Swiss grid.
   Static, not a texture — just enough to imply columns. ────────────── */
export default function GridLines() {
  return (
    <div className="grid-lines" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => <span key={i} />)}
    </div>
  )
}
