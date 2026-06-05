'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ClientStatus } from '../lib/types'

const STATUSES: ClientStatus[] = ['active', 'lead', 'churned']

export function Roster() {
  const { clients, addClient, deleteClient } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [value, setValue] = useState('')
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')

  function handleAdd() {
    const n = name.trim()
    if (!n) return
    const v = Number(value)
    if (isNaN(v)) return
    addClient(n, status, v)
    setName('')
    setValue('')
    setStatus('active')
  }

  const visible = filter === 'all' ? clients : clients.filter((c) => c.status === filter)

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
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ClientStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Add client</button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as ClientStatus | 'all')}
        >
          <option value="all">all</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.status}</span>
            <span>{`$${c.value}`}</span>
            <button aria-label={`Delete ${c.name}`} onClick={() => deleteClient(c.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
