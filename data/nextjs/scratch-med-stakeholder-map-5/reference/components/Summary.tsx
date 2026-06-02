'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { stakeholders } = useApp()
  const total = stakeholders.length
  const high = stakeholders.filter((s) => s.influence === 'high').length
  const med = stakeholders.filter((s) => s.influence === 'med').length
  const low = stakeholders.filter((s) => s.influence === 'low').length
  const supportive = stakeholders.filter((s) => s.supportive).length
  const notSupportive = stakeholders.filter((s) => !s.supportive).length
  const rate = total === 0 ? 0 : Math.round((supportive / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`High: ${high}`}</p>
      <p>{`Med: ${med}`}</p>
      <p>{`Low: ${low}`}</p>
      <p>{`Supportive: ${supportive}`}</p>
      <p>{`Not supportive: ${notSupportive}`}</p>
      <p>{`Support rate: ${rate}%`}</p>
    </section>
  )
}
