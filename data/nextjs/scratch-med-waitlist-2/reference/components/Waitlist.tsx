'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source, StatusFilter } from '../lib/types'

export function Waitlist() {
  const { entries, addEntry, invite, statusFilter, setStatusFilter } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('organic')

  const invitedCount = entries.filter((e) => e.status === 'invited').length
  const visible = entries.filter((e) => statusFilter === 'all' || e.status === statusFilter)

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
          Add
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(ev) => setStatusFilter(ev.target.value as StatusFilter)}
        >
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="invited">invited</option>
        </select>
      </div>
      <p>{`Showing: ${visible.length}`}</p>
      <p>{`Invited: ${invitedCount}`}</p>
      <ul>
        {visible.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            <span>{entry.status}</span>
            {entry.status === 'pending' && (
              <button aria-label={`Invite ${entry.email}`} onClick={() => invite(entry.id)}>
                Invite
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
