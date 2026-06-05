'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Waitlist() {
  const { entries, filter, addEntry, invite, setFilter } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('')

  const total = entries.length
  const invitedCount = entries.filter((e) => e.status === 'invited').length

  const visible =
    filter === 'all'
      ? entries
      : entries.filter((e) => e.status === filter)

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
        <input
          aria-label="Source"
          value={source}
          onChange={(ev) => setSource(ev.target.value)}
        />
        <button
          onClick={() => {
            addEntry(email, source)
            setEmail('')
            setSource('')
          }}
        >
          Add to waitlist
        </button>
      </div>
      <p>{`Total: ${total} | Invited: ${invitedCount}`}</p>
      <div>
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>All</button>
        <button onClick={() => setFilter('pending')} aria-pressed={filter === 'pending'}>Pending</button>
        <button onClick={() => setFilter('invited')} aria-pressed={filter === 'invited'}>Invited</button>
      </div>
      <ul>
        {visible.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            {entry.status === 'pending' ? (
              <button onClick={() => invite(entry.id)}>Invite</button>
            ) : (
              <span>invited</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
