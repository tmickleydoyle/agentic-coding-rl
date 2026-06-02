'use client'
import { useSalon } from '../hooks/useSalon'
import { fmt, endOf } from '../lib/types'
import { conflictingIds } from '../lib/derive'

export function Conflicts() {
  const { appts } = useSalon()
  const ids = conflictingIds(appts)
  const list = appts.filter((a) => ids.has(a.id))
  return (
    <section aria-label="Conflicts view">
      <h1>Conflicts</h1>
      <p>{`Conflicting appointments: ${list.length}`}</p>
      <ul>
        {list.map((a) => (
          <li key={a.id}>{`${a.client} with ${a.stylist}: ${fmt(a.start)}-${fmt(endOf(a))}`}</li>
        ))}
      </ul>
    </section>
  )
}
