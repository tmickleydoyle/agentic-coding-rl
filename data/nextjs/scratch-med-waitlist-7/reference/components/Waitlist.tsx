'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

const FILTERS: Filter[] = ['All', 'Pending', 'Invited']

export function Waitlist() {
  const { entries, filter, setFilter, addEntry, invite } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('')

  const visible = entries.filter((e) => {
    if (filter === 'All') return true
    if (filter === 'Pending') return e.status === 'pending'
    return e.status === 'invited'
  })

  return (
    <section aria-label="Waitlist view">
      <h1>{`Waitlist (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          aria-label="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <button
          onClick={() => {
            addEntry(email, source)
            setEmail('')
            setSource('')
          }}
        >
          Add to Waitlist
        </button>
      </div>
      <div role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <ul>
        {visible.map((e) => (
          <li key={e.id}>
            <span>{e.email}</span>
            <span>{e.source}</span>
            <span>{e.status}</span>
            <button
              aria-label={`Invite ${e.email}`}
              disabled={e.status === 'invited'}
              onClick={() => invite(e.id)}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
