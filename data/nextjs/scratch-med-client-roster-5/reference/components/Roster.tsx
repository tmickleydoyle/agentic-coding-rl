'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

export function Roster() {
  const { clients, filter, setFilter, addClient, removeClient } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    const num = parseFloat(value)
    if (isNaN(num) || num < 0) return
    addClient(trimmed, status, num)
    setName('')
    setValue('')
    setStatus('active')
  }

  const displayed = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  return (
    <section aria-label="Roster view">
      <h1>Roster</h1>
      <div>
        <input
          aria-label="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Lifetime value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          min="0"
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
        <button onClick={handleAdd}>Add client</button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as ClientStatus | 'all')}
        >
          <option value="all">All</option>
          <option value="active">active</option>
          <option value="lead">lead</option>
          <option value="churned">churned</option>
        </select>
      </div>
      <ul>
        {displayed.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{`$${c.value.toFixed(2)}`}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeClient(c.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
