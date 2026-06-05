'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

const FILTERS: (ClientStatus | 'all')[] = ['all', 'active', 'lead', 'churned']

export function Roster() {
  const { clients, addClient, removeClient } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')

  function handleAdd() {
    const parsed = parseFloat(value)
    addClient(name, status, parsed)
    setName('')
    setValue('')
    setStatus('active')
  }

  const visible = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  return (
    <section aria-label="Roster view">
      <h1>Roster</h1>
      <div>
        <label htmlFor="client-name">Client name</label>
        <input
          id="client-name"
          aria-label="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="client-status">Status</label>
        <select
          id="client-status"
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ClientStatus)}
        >
          <option value="active">active</option>
          <option value="lead">lead</option>
          <option value="churned">churned</option>
        </select>
        <label htmlFor="client-value">Lifetime value</label>
        <input
          id="client-value"
          aria-label="Lifetime value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleAdd}>Add client</button>
      </div>
      <div>
        {FILTERS.map((f) => (
          <button
            key={f}
            aria-pressed={filter === f ? 'true' : 'false'}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} clients`}</p>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{`$${c.value}`}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeClient(c.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
