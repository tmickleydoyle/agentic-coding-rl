'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source } from '../lib/types'

type FilterStatus = 'all' | 'pending' | 'invited'

export function Waitlist() {
  const { entries, addEntry, inviteEntry } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('organic')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered =
    filter === 'all' ? entries : entries.filter((e) => e.status === filter)

  const invitedCount = entries.filter((e) => e.status === 'invited').length

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
          <option value="organic">organic</option>
          <option value="referral">referral</option>
          <option value="social">social</option>
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
          onChange={(ev) => setFilter(ev.target.value as FilterStatus)}
        >
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="invited">invited</option>
        </select>
      </div>
      <p>{`Showing: ${filtered.length} entries`}</p>
      <p>{`Invited: ${invitedCount}`}</p>
      <ul>
        {filtered.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            <span>{entry.status}</span>
            {entry.status === 'pending' ? (
              <button
                aria-label={`Invite ${entry.email}`}
                onClick={() => inviteEntry(entry.id)}
              >
                Invite
              </button>
            ) : (
              <span>Invited</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
