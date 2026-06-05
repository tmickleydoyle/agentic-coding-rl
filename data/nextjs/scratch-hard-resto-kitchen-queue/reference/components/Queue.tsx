'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { label } from '../lib/format'

export function Queue() {
  const { tickets, addTicket } = useApp()
  const [table, setTable] = useState('')
  const [item, setItem] = useState('')
  return (
    <section aria-label="Queue view">
      <h1>Queue</h1>
      <input aria-label="Table" type="number" value={table} onChange={(e) => setTable(e.target.value)} />
      <input aria-label="Item" value={item} onChange={(e) => setItem(e.target.value)} />
      <button
        onClick={() => {
          addTicket(table, item)
          setTable('')
          setItem('')
        }}
      >
        Send to kitchen
      </button>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>{label(t)}</li>
        ))}
      </ul>
    </section>
  )
}
