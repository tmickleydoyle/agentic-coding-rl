'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

const STATUS_OPTIONS: ClientStatus[] = ['active', 'lead', 'churned']

export function Clients() {
  const { clients, filter, addClient, removeClient, setFilter } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')

  const displayed = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  return (
    <section aria-label="Clients view">
      <h1>{`Clients (${displayed.length})`}</h1>
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
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          aria-label="Lifetime Value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            const v = parseFloat(value)
            addClient(name, status, v)
            setName('')
            setValue('')
            setStatus('active')
          }}
        >
          Add Client
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as ClientStatus | 'all')}
        >
          <option value="all">all</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
