'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Client } from '../../lib/types'
export function ClientsPage() {
  const { clients, setClients } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const handleAdd = () => {
    if (!name) return
    const c: Client = { id: `c${Date.now()}`, name, email }
    setClients([...clients, c])
    setName(''); setEmail('')
  }
  return (
    <div data-testid="clients-page">
      <h1>Clients</h1>
      <input data-testid="input-client-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input data-testid="input-client-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button data-testid="add-client-btn" onClick={handleAdd}>Add Client</button>
      {clients.map(c => (
        <div key={c.id} data-testid={`client-item-${c.id}`}><span>{c.name}</span><span>{c.email}</span></div>
      ))}
    </div>
  )
}
