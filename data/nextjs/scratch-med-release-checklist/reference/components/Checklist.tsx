'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { tasks, addTask, toggleTask } = useApp()
  const [taskName, setTaskName] = useState('')
  const [owner, setOwner] = useState('')
  const [filterOwner, setFilterOwner] = useState('All')

  const owners: string[] = []
  tasks.forEach((t) => {
    if (!owners.includes(t.owner)) owners.push(t.owner)
  })

  const filtered = filterOwner === 'All' ? tasks : tasks.filter((t) => t.owner === filterOwner)
  const remaining = tasks.filter((t) => !t.done).length

  return (
    <section aria-label="Checklist view">
      <h1>{`Tasks remaining: ${remaining}`}</h1>
      <input
        aria-label="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <input
        aria-label="Owner"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
      <button
        onClick={() => {
          addTask(taskName, owner)
          setTaskName('')
          setOwner('')
        }}
      >
        Add task
      </button>
      <label>
        Filter by owner
        <select
          aria-label="Filter by owner"
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
        >
          <option value="All">All</option>
          {owners.map((o) => (
            <option key={o} value={o}>{o === '' ? '(none)' : o}</option>
          ))}
        </select>
      </label>
      <ul>
        {filtered.map((t) => (
          <li key={t.id}>
            <span>{t.title}</span>
            <span>{`Owner: ${t.owner || '—'}`}</span>
            <label>
              <input
                type="checkbox"
                aria-label={`Done: ${t.title}`}
                checked={t.done}
                onChange={() => toggleTask(t.id)}
              />
              Done
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
