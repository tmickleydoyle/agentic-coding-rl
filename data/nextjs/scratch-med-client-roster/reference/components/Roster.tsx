'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

const FILTERS: ['all' | ClientStatus, string][] = [
  ['all', 'All'],
  ['active', 'Active'],
  ['lead', 'Lead'],
  ['churned', 'Churned'],
]

function fmt(v: number) {
  return `$${v.toFixed(2)}`
}

export function Roster() {
  const { clients, filter, setFilter, addClient, removeClient } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')

  const visible = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  return (
    <section aria-label="Roster view">
      <h1>Roster</h1>
      <div>
        <input
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ClientStatus)}
        >
          <option value="active">active</option>
          <option value="lead">lead</option>
          <option value="churned">churned</option>
        </select>
        <input
          aria-label="Lifetime Value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            addClient(name, status, parseFloat(value))
            setName('')
            setValue('')
          }}
        >
          Add Client
        </button>
      </div>
      <div>
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {label}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} clients`}</p>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{fmt(c.value)}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeClient(c.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
