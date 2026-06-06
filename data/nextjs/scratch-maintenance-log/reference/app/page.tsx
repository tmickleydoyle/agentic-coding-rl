'use client'
import { useState } from 'react'

const SEED = [
  { id: 1, title: 'Fix leaky faucet', area: 'Kitchen', priority: 'High', status: 'Open', date: '2024-01-15' },
  { id: 2, title: 'Replace air filter', area: 'HVAC', priority: 'Medium', status: 'Completed', date: '2024-01-20' },
  { id: 3, title: 'Patch ceiling crack', area: 'Bedroom', priority: 'Low', status: 'Open', date: '2024-02-05' },
  { id: 4, title: 'Unclog drain', area: 'Bathroom', priority: 'High', status: 'In Progress', date: '2024-02-10' },
  { id: 5, title: 'Touch up paint', area: 'Living Room', priority: 'Low', status: 'Open', date: '2024-03-01' },
  { id: 6, title: 'Seal window gaps', area: 'Living Room', priority: 'Medium', status: 'Open', date: '2024-03-15' },
]

export default function App() {
  const [entries, setEntries] = useState(SEED.map(e => ({ ...e })))
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [newTitle, setNewTitle] = useState('')
  const [newArea, setNewArea] = useState('')
  const [newPriority, setNewPriority] = useState('High')
  const [newDate, setNewDate] = useState('')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const openCount = entries.filter(e => e.status === 'Open').length
  const inProgressCount = entries.filter(e => e.status === 'In Progress').length
  const completedCount = entries.filter(e => e.status === 'Completed').length

  const visible = entries.filter(e => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false
    if (priorityFilter !== 'All' && e.priority !== priorityFilter) return false
    return true
  })

  function changeStatus(id: number, status: string) {
    setEntries(es => es.map(e => e.id === id ? { ...e, status } : e))
  }

  function deleteEntry(id: number) {
    setEntries(es => es.filter(e => e.id !== id))
  }

  function addEntry() {
    if (!newTitle.trim() || !newArea.trim()) return
    setEntries(es => [...es, {
      id: nextId,
      title: newTitle.trim(),
      area: newArea.trim(),
      priority: newPriority,
      status: 'Open',
      date: newDate,
    }])
    setNextId(n => n + 1)
    setNewTitle('')
    setNewArea('')
    setNewDate('')
  }

  return (
    <div>
      <h1>Maintenance Log</h1>

      <div>
        <p data-testid="open-count">Open: {openCount}</p>
        <p data-testid="in-progress-count">In Progress: {inProgressCount}</p>
        <p data-testid="completed-count">Completed: {completedCount}</p>
      </div>

      <div>
        <label>
          Status Filter
          <select
            aria-label="Status Filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label>
          Priority Filter
          <select
            aria-label="Priority Filter"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visible.map(e => (
          <li key={e.id} data-testid="log-entry">
            <h2>{e.title}</h2>
            <p>{e.area}</p>
            <span data-testid="priority-badge">{e.priority}</span>
            <span data-testid="status-badge">{e.status}</span>
            <p>{e.date}</p>
            <label>
              Change Status
              <select
                aria-label="Change Status"
                value={e.status}
                onChange={ev => changeStatus(e.id, ev.target.value)}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <button onClick={() => deleteEntry(e.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
        <label>
          Title
          <input
            aria-label="Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </label>

        <label>
          Area
          <input
            aria-label="Area"
            value={newArea}
            onChange={e => setNewArea(e.target.value)}
          />
        </label>

        <label>
          Priority
          <select
            aria-label="Priority"
            value={newPriority}
            onChange={e => setNewPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>

        <label>
          Date
          <input
            aria-label="Date"
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
          />
        </label>

        <button onClick={addEntry}>Add Entry</button>
      </div>
    </div>
  )
}
