'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { interviews } = useApp()
  const total = interviews.length

  const segmentOrder: string[] = []
  const segmentCounts: Record<string, number> = {}
  interviews.forEach((i) => {
    if (!segmentCounts[i.segment]) {
      segmentOrder.push(i.segment)
      segmentCounts[i.segment] = 0
    }
    segmentCounts[i.segment] += 1
  })

  let topSegment = '—'
  if (segmentOrder.length > 0) {
    topSegment = segmentOrder[0]
    let topCount = segmentCounts[segmentOrder[0]]
    for (let idx = 1; idx < segmentOrder.length; idx++) {
      const seg = segmentOrder[idx]
      if (segmentCounts[seg] > topCount) {
        topSegment = seg
        topCount = segmentCounts[seg]
      }
    }
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total interviews: ${total}`}</p>
      {segmentOrder.map((seg) => (
        <p key={seg}>{`${seg}: ${segmentCounts[seg]}`}</p>
      ))}
      <p>{`Top segment: ${topSegment}`}</p>
    </section>
  )
}
