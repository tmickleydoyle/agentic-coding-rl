'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

const fmt = (n: number) => `$${n.toFixed(2)}`

export function Clients() {
  const { clients, addClient, removeClient } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [lifetimeValue, setLifetimeValue] = useState('')
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')

  const visible = filter === 'all' ? clients : clients.filter((c) => c.status === filter)
  const visibleTotal = visible.reduce((s, c) => s + c.lifetimeValue, 0)

  function handleAdd() {
    const lv = parseFloat(lifetimeValue)
    addClient(name, status, isNaN(lv) ? 0 : lv)
    setName('')
    setLifetimeValue('')
    setStatus('active')
  }

  return (
    <section aria-label="Clients view">
      <h1>Clients</h1>
      <div>
        <label>
          Name
          <input aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Status
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
            <option value="active">active</option>
            <option value="lead">lead</option>
            <option value="churned">churned</option>
          </select>
        </label>
        <label>
          Lifetime Value
          <input aria-label="Lifetime Value" type="number" value={lifetimeValue} onChange={(e) => setLifetimeValue(e.target.value)} />
        </label>
        <button onClick={handleAdd}>Add Client</button>
      </div>
      <div>
        <label>
          Filter by status
          <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value as ClientStatus | 'all')}>
            <option value="all">all</option>
            <option value="active">active</option>
            <option value="lead">lead</option>
            <option value="churned">churned</option>
          </select>
        </label>
      </div>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{fmt(c.lifetimeValue)}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeClient(c.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>{`Visible: ${visible.length} clients`}</p>
      <p>{`Visible Total: ${fmt(visibleTotal)}`}</p>
    </section>
  )
}
