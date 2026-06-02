'use client'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

export function Stats() {
  const { bugs } = useApp()
  const total = bugs.length
  const open = bugs.filter((b) => b.status === 'open').length
  const closed = bugs.filter((b) => b.status === 'closed').length
  const openBySeverity = (s: Severity) => bugs.filter((b) => b.status === 'open' && b.severity === s).length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total bugs: ${total}`}</p>
      <p>{`Open: ${open}`}</p>
      <p>{`Closed: ${closed}`}</p>
      <p>{`Critical open: ${openBySeverity('critical')}`}</p>
      <p>{`High open: ${openBySeverity('high')}`}</p>
      <p>{`Medium open: ${openBySeverity('medium')}`}</p>
      <p>{`Low open: ${openBySeverity('low')}`}</p>
    </section>
  )
}
