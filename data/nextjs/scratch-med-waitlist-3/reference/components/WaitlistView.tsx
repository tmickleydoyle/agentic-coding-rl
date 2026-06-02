'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source, StatusFilter } from '../lib/types'

const SOURCES: Source[] = ['Twitter', 'LinkedIn', 'Referral', 'Other']
const FILTERS: StatusFilter[] = ['All', 'Pending', 'Invited']

export function WaitlistView() {
  const { entries, addEntry, invite, clearInvited, statusFilter, setStatusFilter } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('Twitter')

  const filtered = entries.filter((e) => {
    if (statusFilter === 'All') return true
    if (statusFilter === 'Pending') return e.status === 'pending'
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
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            addEntry(email, source)
            setEmail('')
          }}
        >
          Add to Waitlist
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <button onClick={clearInvited}>Clear Invited</button>
      </div>
      <p>{`Showing: ${filtered.length} entries`}</p>
      <ul>
        {filtered.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{` (${entry.source})`}</span>
            <span>{` ${entry.status}`}</span>
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
