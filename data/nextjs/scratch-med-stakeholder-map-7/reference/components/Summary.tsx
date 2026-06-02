'use client'
import { useApp } from '../hooks/useApp'
import type { Influence } from '../lib/types'

export function Summary() {
  const { stakeholders } = useApp()
  const total = stakeholders.length
  const count = (inf: Influence) => stakeholders.filter((s) => s.influence === inf).length
  const supportiveCount = stakeholders.filter((s) => s.supportive).length
  const pct = total === 0 ? 0 : Math.round((supportiveCount / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`High: ${count('High')}`}</p>
      <p>{`Med: ${count('Med')}`}</p>
      <p>{`Low: ${count('Low')}`}</p>
      <p>{`Supportive: ${supportiveCount}`}</p>
      <p>{`Support rate: ${pct}%`}</p>
    </section>
  )
}
