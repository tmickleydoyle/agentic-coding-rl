'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source, StatusFilter } from '../lib/types'

const SOURCES: Source[] = ['Twitter', 'Reddit', 'Direct']
const FILTERS: StatusFilter[] = ['All', 'Pending', 'Invited']

export function Waitlist() {
  const { entries, filter, setFilter, addEntry, invite } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('Twitter')

  const visible = entries.filter((e) => {
    if (filter === 'All') return true
    if (filter === 'Pending') return e.status === 'pending'
    return e.status === 'invited'
  })

  return (
    <section aria-label="Waitlist view">
      <h1>Waitlist</h1>
      <div>
        <input
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          aria-label="Source"
          value={source}
          onChange={(e) => setSource(e.target.value as Source)}
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addEntry(email, source)
            setEmail('')
          }}
        >
          Add to waitlist
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as StatusFilter)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length} of ${entries.length}`}</p>
      <ul>
        {visible.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            <span>{entry.status === 'pending' ? 'pending' : 'invited'}</span>
            {entry.status === 'pending' && (
              <button
                aria-label={`Invite ${entry.email}`}
                onClick={() => invite(entry.id)}
              >
                Invite
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
