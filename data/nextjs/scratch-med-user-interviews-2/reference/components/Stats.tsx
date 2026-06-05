'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { interviews } = useApp()
  const total = interviews.length

  const segmentOrder: string[] = []
  const segmentCount: Record<string, number> = {}
  interviews.forEach((iv) => {
    if (!(iv.segment in segmentCount)) {
      segmentOrder.push(iv.segment)
      segmentCount[iv.segment] = 0
    }
    segmentCount[iv.segment] += 1
  })

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total interviews: ${total}`}</p>
      {segmentOrder.map((seg) => (
        <p key={seg}>{`${seg}: ${segmentCount[seg]}`}</p>
      ))}
      <p>{`Segments tracked: ${segmentOrder.length}`}</p>
    </section>
  )
}
