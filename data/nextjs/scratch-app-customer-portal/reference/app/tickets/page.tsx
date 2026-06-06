'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Ticket } from '../../lib/types'

export function TicketsPage() {
  const { triggerRefresh } = useApp()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<Ticket['priority']>('medium')

  function load() { fetch('/api/tickets').then(r => r.json()).then(setTickets) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, priority }),
    })
    setSubject(''); setPriority('medium')
    load(); triggerRefresh()
  }

  async function handleClose(id: string) {
    await fetch(`/api/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' }),
    })
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Support Tickets</h1>
      <form data-testid="add-ticket-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-ticket-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
        <select data-testid="select-ticket-priority" value={priority} onChange={e => setPriority(e.target.value as Ticket['priority'])} required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button data-testid="btn-add-ticket" type="submit">Add Ticket</button>
      </form>
      <ul data-testid="ticket-list" style={{ listStyle: 'none', padding: 0 }}>
        {tickets.map(t => (
          <li key={t.id} data-testid="ticket-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <span data-testid="ticket-subject" style={{ fontWeight: 'bold' }}>{t.subject}</span>
              {' | '}
              <span data-testid="ticket-priority">{t.priority}</span>
              {' | '}
              <span data-testid="ticket-status">{t.status}</span>
            </span>
            {t.status !== 'closed' && (
              <button data-testid="btn-close-ticket" onClick={() => handleClose(t.id)}>Close</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
