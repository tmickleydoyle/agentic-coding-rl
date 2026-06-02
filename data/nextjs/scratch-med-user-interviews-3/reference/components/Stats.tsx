'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { interviews } = useApp()
  const total = interviews.length

  const segmentOrder: string[] = []
  const segmentCount: Record<string, number> = {}
  interviews.forEach((i) => {
    if (!(i.segment in segmentCount)) {
      segmentOrder.push(i.segment)
      segmentCount[i.segment] = 0
    }
    segmentCount[i.segment] += 1
  })

  let topSegment = '—'
  let topCount = 0
  segmentOrder.forEach((seg) => {
    if (segmentCount[seg] > topCount) {
      topCount = segmentCount[seg]
      topSegment = seg
    }
  })

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total interviews: ${total}`}</p>
      {segmentOrder.map((seg) => (
        <p key={seg}>{`${seg}: ${segmentCount[seg]}`}</p>
      ))}
      <p>{`Top segment: ${topSegment}`}</p>
    </section>
  )
}
