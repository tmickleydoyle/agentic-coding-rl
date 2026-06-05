'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source, StatusFilter } from '../lib/types'

const SOURCES: Source[] = ['organic', 'referral', 'social']
const FILTERS: StatusFilter[] = ['all', 'pending', 'invited']

export function Waitlist() {
  const { entries, filter, addEntry, invite, setFilter } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('organic')

  const visible = entries.filter((e) => filter === 'all' || e.status === filter)

  return (
    <section aria-label="Waitlist view">
      <h1>Waitlist</h1>
      <div>
        <input
          aria-label="Email"
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <select
          aria-label="Source"
          value={source}
          onChange={(ev) => setSource(ev.target.value as Source)}
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
          Add
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value as StatusFilter)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <h2>{`Entries (${visible.length})`}</h2>
      <ul>
        {visible.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            <span>{entry.status}</span>
            <button
              aria-label={`Invite ${entry.email}`}
              disabled={entry.status === 'invited'}
              onClick={() => invite(entry.id)}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
