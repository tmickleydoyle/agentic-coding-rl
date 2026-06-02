'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

const FILTERS: [ClientStatus | 'all', string][] = [
  ['all', 'All'],
  ['active', 'Active'],
  ['lead', 'Lead'],
  ['churned', 'Churned'],
]

export function Clients() {
  const { clients, filter, setFilter, addClient, deleteClient } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [lv, setLv] = useState('')

  function handleAdd() {
    const val = parseFloat(lv)
    addClient(name, status, val)
    setName('')
    setLv('')
    setStatus('active')
  }

  const visible = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  return (
    <section aria-label="Clients view">
      <h1>Clients</h1>
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
          value={lv}
          type="number"
          min={0}
          onChange={(e) => setLv(e.target.value)}
        />
        <button onClick={handleAdd}>Add Client</button>
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
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{`$${c.lifetimeValue.toFixed(2)}`}</span>
            <button aria-label={`Delete ${c.name}`} onClick={() => deleteClient(c.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length} clients`}</p>
    </section>
  )
}
