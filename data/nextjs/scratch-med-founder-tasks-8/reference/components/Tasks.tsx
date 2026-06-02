'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['high', 'med', 'low']

export function Tasks() {
  const { tasks, addTask, toggleDone, deleteTask } = useApp()
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<Priority>('med')
  const [filter, setFilter] = useState<Priority | 'all'>('all')

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.priority === filter)

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
          onChange={(e) => setFilter(e.target.value as Priority | 'all')}
        >
          <option value="all">all</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length} tasks`}</p>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{t.priority}</span>
            <input
              type="checkbox"
              aria-label={`Done: ${t.name}`}
              checked={t.done}
              onChange={() => toggleDone(t.id)}
            />
            <button aria-label={`Delete ${t.name}`} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
