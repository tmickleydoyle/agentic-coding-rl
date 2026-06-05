'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { interviews } = useApp()
  const total = interviews.length

  const segmentOrder: string[] = []
  const segmentCount: { [key: string]: number } = {}
  interviews.forEach((i) => {
    if (!(i.segment in segmentCount)) {
      segmentOrder.push(i.segment)
      segmentCount[i.segment] = 0
    }
    segmentCount[i.segment] += 1
  })

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      {total === 0 ? (
        <p>No interviews yet.</p>
      ) : (
        <>
          <p>{`Total interviews: ${total}`}</p>
          <ul>
            {segmentOrder.map((seg) => (
              <li key={seg}>{`${seg}: ${segmentCount[seg]}`}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
