'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']

export function Tasks() {
  const { tasks, addTask, toggleDone } = useApp()
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<Priority>('High')
  const [filter, setFilter] = useState<Priority | 'All'>('All')

  const visible = tasks.filter((t) => filter === 'All' || t.priority === filter)

  return (
    <section aria-label="Tasks view">
      <h1>Tasks</h1>
      <div>
        <input
          aria-label="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            addTask(name, priority)
            setName('')
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
      <p>{`Showing: ${visible.length} tasks`}</p>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.done ? `${t.name} (done)` : t.name}</span>
            <span>{` [${t.priority}]`}</span>
            <button
              aria-label={t.done ? `Mark undone ${t.name}` : `Mark done ${t.name}`}
              onClick={() => toggleDone(t.id)}
            >
              {t.done ? 'Mark undone' : 'Mark done'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
