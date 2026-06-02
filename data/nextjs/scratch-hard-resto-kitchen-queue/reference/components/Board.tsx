'use client'
import { useApp } from '../hooks/useApp'
import { label } from '../lib/format'

export function Board() {
  const { tickets, advance } = useApp()
  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <span>{label(t)}</span>
            {t.stage !== 'Served' && <button onClick={() => advance(t.id)}>Advance</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}
