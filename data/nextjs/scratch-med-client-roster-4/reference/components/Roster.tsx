'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

function fmt(v: number) {
  return `$${v.toFixed(2)}`
}

export function Roster() {
  const { clients, filter, addClient, removeClient, setFilter } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')

  const visible = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  function handleAdd() {
    const v = parseFloat(value)
    if (!name.trim() || isNaN(v) || v <= 0) return
    addClient(name, status, v)
    setName('')
    setStatus('active')
    setValue('')
  }

  return (
    <section aria-label="Roster view">
      <h1>Roster</h1>
      <input
        aria-label="Client name"
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
        aria-label="Lifetime value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="number"
        min="0"
      />
      <button onClick={handleAdd}>Add client</button>

      <select
        aria-label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value as ClientStatus | 'all')}
      >
        <option value="all">all</option>
        <option value="active">active</option>
        <option value="lead">lead</option>
        <option value="churned">churned</option>
      </select>

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
      <p>{`Showing: ${visible.length} clients`}</p>
    </section>
  )
}
