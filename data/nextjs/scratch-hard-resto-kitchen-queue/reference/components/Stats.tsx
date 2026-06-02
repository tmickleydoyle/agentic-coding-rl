'use client'
import { useApp } from '../hooks/useApp'
import { STAGES } from '../lib/types'

export function Stats() {
  const { tickets } = useApp()
  const count = (s: string) => tickets.filter((t) => t.stage === s).length
  const open = tickets.filter((t) => t.stage !== 'Served')
  let active = 'none'
  open.forEach((t) => {
    if (active === 'none' || t.table < Number(active)) active = String(t.table)
  })
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      {STAGES.map((s) => (
        <p key={s}>{`${s}: ${count(s)}`}</p>
      ))}
      <p>{`Open tickets: ${open.length}`}</p>
      <p>{`Active table: ${active}`}</p>
    </section>
  )
}
