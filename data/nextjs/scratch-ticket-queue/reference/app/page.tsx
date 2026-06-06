'use client'
import { useState } from 'react'

type Priority = 'high' | 'medium' | 'low'
type Status = 'open' | 'in-progress' | 'resolved'

interface Ticket {
  id: number
  title: string
  priority: Priority
  status: Status
  submitter: string
  created: string
}

const SEED: Ticket[] = [
  { id: 1, title: 'Login page broken', priority: 'high', status: 'open', submitter: 'Alice', created: '2025-01-10' },
  { id: 2, title: 'Export CSV feature', priority: 'low', status: 'open', submitter: 'Bob', created: '2025-01-11' },
  { id: 3, title: 'Dashboard slow', priority: 'medium', status: 'in-progress', submitter: 'Carol', created: '2025-01-12' },
  { id: 4, title: 'Password reset email', priority: 'high', status: 'resolved', submitter: 'Dave', created: '2025-01-13' },
  { id: 5, title: 'Mobile nav broken', priority: 'medium', status: 'open', submitter: 'Eve', created: '2025-01-14' },
]

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(SEED.map(t => ({ ...t })))
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('medium')
  const [newSubmitter, setNewSubmitter] = useState('')

  function updateStatus(id: number, status: Status) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  function addTicket() {
    const title = newTitle.trim()
    const submitter = newSubmitter.trim()
    if (!title || !submitter) return
    const maxId = tickets.reduce((m, t) => Math.max(m, t.id), 0)
    const ticket: Ticket = {
      id: maxId + 1,
      title,
      priority: newPriority,
      status: 'open',
      submitter,
      created: new Date().toISOString().slice(0, 10),
    }
    setTickets(prev => [...prev, ticket])
    setNewTitle('')
    setNewPriority('medium')
    setNewSubmitter('')
  }

  const filtered = tickets
    .filter(t => statusFilter === 'all' || t.status === statusFilter)
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .sort((a, b) => {
      const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      return pd !== 0 ? pd : a.id - b.id
    })

  const countOpen = tickets.filter(t => t.status === 'open').length
  const countInProgress = tickets.filter(t => t.status === 'in-progress').length
  const countResolved = tickets.filter(t => t.status === 'resolved').length

  return (
    <div>
      <h1>Ticket Queue</h1>

      <div>
        <span data-testid="count-open">Open: {countOpen}</span>
        <span data-testid="count-in-progress">In Progress: {countInProgress}</span>
        <span data-testid="count-resolved">Resolved: {countResolved}</span>
      </div>

      <div>
        <select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">all</option>
          <option value="open">open</option>
          <option value="in-progress">in-progress</option>
          <option value="resolved">resolved</option>
        </select>
        <select aria-label="Filter by priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">all</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
      </div>

      <p data-testid="showing-count">Showing {filtered.length} tickets</p>

      <ul>
        {filtered.map(t => (
          <li key={t.id} data-testid={`ticket-${t.id}`}>
            <span>{t.title}</span>
            <span data-testid={`priority-${t.id}`}>{t.priority}</span>
            <select
              aria-label={`Status for ${t.title}`}
              value={t.status}
              onChange={e => updateStatus(t.id, e.target.value as Status)}
            >
              <option value="open">open</option>
              <option value="in-progress">in-progress</option>
              <option value="resolved">resolved</option>
            </select>
            <span>{t.submitter}</span>
            <span>{t.created}</span>
          </li>
        ))}
      </ul>

      <div>
        <h2>Add Ticket</h2>
        <input aria-label="Ticket title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
        <select aria-label="Priority" value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)}>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <input aria-label="Submitter name" value={newSubmitter} onChange={e => setNewSubmitter(e.target.value)} />
        <button onClick={addTicket}>Add Ticket</button>
      </div>
    </div>
  )
}
