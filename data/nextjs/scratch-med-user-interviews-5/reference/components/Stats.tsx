'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { interviews } = useApp()
  const total = interviews.length

  const segmentCounts: Record<string, number> = {}
  interviews.forEach((i) => {
    segmentCounts[i.segment] = (segmentCounts[i.segment] ?? 0) + 1
  })
  const segments = Object.keys(segmentCounts)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total interviews: ${total}`}</p>
      {segments.map((seg) => (
        <p key={seg}>{`Segment: ${seg} — ${segmentCounts[seg]}`}</p>
      ))}
      <p>{`Segments tracked: ${segments.length}`}</p>
    </section>
  )
}
