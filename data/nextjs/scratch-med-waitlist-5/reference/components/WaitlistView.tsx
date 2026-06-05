'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source } from '../lib/types'

const SOURCES: Source[] = ['twitter', 'linkedin', 'referral', 'other']

export function WaitlistView() {
  const { entries, addEntry, inviteEntry, statusFilter, setStatusFilter } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('twitter')

  const total = entries.length
  const invitedCount = entries.filter((e) => e.status === 'invited').length

  const filtered = entries.filter((e) => {
    if (statusFilter === 'all') return true
    return e.status === statusFilter
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
          Add
        </button>
      </div>

      <div>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="invited">invited</option>
        </select>
      </div>

      <p>{`Invited: ${invitedCount} of ${total}`}</p>

      <ul>
        {filtered.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            <span>{entry.status}</span>
            <button
              aria-label={`Invite ${entry.email}`}
              disabled={entry.status === 'invited'}
              onClick={() => inviteEntry(entry.id)}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
