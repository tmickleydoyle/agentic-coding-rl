'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['High', 'Med', 'Low']

export function Tasks() {
  const { tasks, filter, addTask, toggleDone, deleteTask, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('High')

  const visible = filter === 'All' ? tasks : tasks.filter((t) => t.priority === filter)

  return (
    <section aria-label="Tasks view">
      <h1>Tasks</h1>
      <input
        aria-label="Task name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        aria-label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addTask(title, priority)
          setTitle('')
        }}
      >
        Add task
      </button>
      <select
        aria-label="Filter by priority"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Priority | 'All')}
      >
        <option value="All">All</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.title}</span>
            <span>{t.priority}</span>
            <input
              type="checkbox"
              aria-label={`Done ${t.title}`}
              checked={t.done}
              onChange={() => toggleDone(t.id)}
            />
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length} task(s)`}</p>
    </section>
  )
}
