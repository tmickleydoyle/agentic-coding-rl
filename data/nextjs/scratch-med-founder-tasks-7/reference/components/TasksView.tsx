'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']

export function TasksView() {
  const { tasks, addTask, toggleDone, deleteTask } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('High')
  const [filter, setFilter] = useState<Priority | 'All'>('All')

  const filtered = filter === 'All' ? tasks : tasks.filter((t) => t.priority === filter)

  return (
    <section aria-label="Tasks view">
      <h1>Tasks</h1>
      <div>
        <input
          aria-label="Task title"
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
      </div>
      <div>
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
      </div>
      <ul>
        {filtered.map((t) => (
          <li key={t.id}>
            <span>{t.title}</span>
            <span>{t.priority}</span>
            <input
              type="checkbox"
              aria-label={`Done ${t.title}`}
              checked={t.done}
              onChange={() => toggleDone(t.id)}
            />
            <button aria-label={`Delete ${t.title}`} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${filtered.length} tasks`}</p>
    </section>
  )
}
