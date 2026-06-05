'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { stakeholders } = useApp()
  const total = stakeholders.length
  const high = stakeholders.filter((s) => s.influence === 'High').length
  const medium = stakeholders.filter((s) => s.influence === 'Medium').length
  const low = stakeholders.filter((s) => s.influence === 'Low').length
  const supportiveCount = stakeholders.filter((s) => s.supportive).length
  const pct = total === 0 ? 0 : Math.round((supportiveCount / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total stakeholders: ${total}`}</p>
      <p>{`High: ${high}`}</p>
      <p>{`Medium: ${medium}`}</p>
      <p>{`Low: ${low}`}</p>
      <p>{`Supportive: ${supportiveCount}`}</p>
      <p>{`Support rate: ${pct}%`}</p>
    </section>
  )
}
