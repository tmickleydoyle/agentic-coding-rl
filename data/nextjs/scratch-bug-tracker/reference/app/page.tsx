'use client'
import { useState } from 'react'

type Status = 'open' | 'in-progress' | 'closed'
type Priority = 'low' | 'medium' | 'high'

interface Bug {
  id: number
  title: string
  status: Status
  priority: Priority
  assignee: string
}

const SEED: Bug[] = [
  { id: 1, title: 'Login page crashes on Safari', status: 'open', priority: 'high', assignee: 'Alice' },
  { id: 2, title: 'Dashboard slow to load', status: 'in-progress', priority: 'medium', assignee: 'Bob' },
  { id: 3, title: 'Export button missing', status: 'closed', priority: 'low', assignee: 'Alice' },
]

const STATUS_CYCLE: Status[] = ['open', 'in-progress', 'closed']

export default function App() {
  const [bugs, setBugs] = useState<Bug[]>(SEED.map(b => ({ ...b })))
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [assignee, setAssignee] = useState('')
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [nextId, setNextId] = useState(4)

  function addBug() {
    if (!title.trim()) return
    setBugs(prev => [...prev, { id: nextId, title: title.trim(), status: 'open', priority, assignee: assignee.trim() }])
    setNextId(n => n + 1)
    setTitle('')
    setPriority('medium')
    setAssignee('')
  }

  function advanceStatus(id: number) {
    setBugs(prev => prev.map(b => {
      if (b.id !== id) return b
      const idx = STATUS_CYCLE.indexOf(b.status)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return { ...b, status: next }
    }))
  }

  function deleteBug(id: number) {
    setBugs(prev => prev.filter(b => b.id !== id))
  }

  const countOpen = bugs.filter(b => b.status === 'open').length
  const countInProgress = bugs.filter(b => b.status === 'in-progress').length
  const countClosed = bugs.filter(b => b.status === 'closed').length

  const visible = filter === 'All' ? bugs : bugs.filter(b => b.status === filter)

  return (
    <div>
      <h1>Bug Tracker</h1>

      <div>
        <span data-testid="count-open">Open: {countOpen}</span>
        <span data-testid="count-in-progress">In Progress: {countInProgress}</span>
        <span data-testid="count-closed">Closed: {countClosed}</span>
      </div>

      <div>
        <input
          aria-label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <select
          aria-label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input
          aria-label="Assignee"
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
        />
        <button onClick={addBug}>Add Bug</button>
      </div>

      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={e => setFilter(e.target.value as 'All' | Status)}
        >
          <option value="All">All</option>
          <option value="open">open</option>
          <option value="in-progress">in-progress</option>
          <option value="closed">closed</option>
        </select>
      </div>

      <ul>
        {visible.map(bug => (
          <li key={bug.id} data-testid="bug-item">
            <span data-testid="bug-title">{bug.title}</span>
            <span data-testid="bug-status">{bug.status}</span>
            <span data-testid="bug-priority">{bug.priority}</span>
            <span data-testid="bug-assignee">{bug.assignee}</span>
            <button onClick={() => advanceStatus(bug.id)}>Next Status</button>
            <button onClick={() => deleteBug(bug.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
