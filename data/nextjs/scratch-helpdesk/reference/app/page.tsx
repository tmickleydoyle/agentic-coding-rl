'use client'
import { useState } from 'react'

type Status = 'Open' | 'In Progress' | 'Closed'
type Ticket = { id: number; title: string; status: Status }

const STATUSES: Status[] = ['Open', 'In Progress', 'Closed']

function nextStatus(s: Status): Status {
  const idx = STATUSES.indexOf(s)
  return STATUSES[Math.min(idx + 1, STATUSES.length - 1)]
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [input, setInput] = useState('')
  const [nextId, setNextId] = useState(1)
  const [filter, setFilter] = useState<Status | 'All'>('All')

  function createTicket() {
    const t = input.trim()
    if (!t) return
    setTickets((ts) => [...ts, { id: nextId, title: t, status: 'Open' }])
    setNextId((n) => n + 1)
    setInput('')
  }

  function advance(id: number) {
    setTickets((ts) =>
      ts.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t))
    )
  }

  const counts: Record<Status, number> = { Open: 0, 'In Progress': 0, Closed: 0 }
  tickets.forEach((t) => { counts[t.status]++ })

  const visible = filter === 'All' ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <div>
      <h1>Support Queue</h1>
      <div>
        <input
          aria-label="Ticket title"
          placeholder="Ticket title"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={createTicket}>Create ticket</button>
      </div>
      <div>
        <button onClick={() => setFilter('All')}>Show All</button>
        <button onClick={() => setFilter('Open')}>Show Open</button>
        <button onClick={() => setFilter('In Progress')}>Show In Progress</button>
        <button onClick={() => setFilter('Closed')}>Show Closed</button>
      </div>
      <p>{`Open: ${counts['Open']} | In Progress: ${counts['In Progress']} | Closed: ${counts['Closed']}`}</p>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.title}</span>
            <span>{t.status}</span>
            <button onClick={() => advance(t.id)} disabled={t.status === 'Closed'}>
              Advance
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
