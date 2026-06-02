'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { interviews } = useApp()
  const total = interviews.length

  const segmentMap: Record<string, number> = {}
  interviews.forEach((i) => {
    segmentMap[i.segment] = (segmentMap[i.segment] ?? 0) + 1
  })
  const segments = Object.keys(segmentMap).sort()

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total interviews: ${total}`}</p>
      {segments.length === 0 ? (
        <p>No interviews yet</p>
      ) : (
        <ul>
          {segments.map((seg) => (
            <li key={seg}>{`Segment: ${seg} — ${segmentMap[seg]} interview(s)`}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
