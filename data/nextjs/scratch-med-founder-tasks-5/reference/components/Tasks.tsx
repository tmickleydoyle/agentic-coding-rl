'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

export function Tasks() {
  const { tasks, filter, addTask, toggleDone, setFilter } = useApp()
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<Priority>('med')

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
          <option value="high">high</option>
          <option value="med">med</option>
          <option value="low">low</option>
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
          <option value="high">high</option>
          <option value="med">med</option>
          <option value="low">low</option>
        </select>
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{t.priority}</span>
            <button onClick={() => toggleDone(t.id)}>
              {t.done ? 'Mark undone' : 'Mark done'}
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length} tasks`}</p>
    </section>
  )
}
