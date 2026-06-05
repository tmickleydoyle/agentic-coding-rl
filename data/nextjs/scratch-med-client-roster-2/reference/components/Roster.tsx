'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

export function Roster() {
  const { clients, addClient, removeClient, filterStatus, setFilterStatus } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')

  function handleAdd() {
    const v = parseFloat(value)
    addClient(name, status, v)
    setName('')
    setValue('')
    setStatus('active')
  }

  const filtered = filterStatus === 'all' ? clients : clients.filter((c) => c.status === filterStatus)
  const total = filtered.reduce((sum, c) => sum + c.value, 0)

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
        <button onClick={handleAdd}>Add Client</button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ClientStatus | 'all')}
        >
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="lead">lead</option>
          <option value="churned">churned</option>
        </select>
      </div>
      <ul>
        {filtered.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{`$${c.value}`}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeClient(c.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>{`Total: $${total}`}</p>
    </section>
  )
}
