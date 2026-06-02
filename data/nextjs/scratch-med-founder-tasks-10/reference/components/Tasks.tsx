'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['high', 'medium', 'low']
const PRIORITY_LABELS: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' }
const FILTER_OPTIONS: Array<Priority | 'all'> = ['all', 'high', 'medium', 'low']
const FILTER_LABELS: Record<Priority | 'all', string> = { all: 'All', high: 'High', medium: 'Medium', low: 'Low' }

export function Tasks() {
  const { tasks, filter, setFilter, addTask, toggleDone } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('high')

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.priority === filter)

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
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
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
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.title}</span>
            <span>{PRIORITY_LABELS[t.priority]}</span>
            <label>
              <input
                type="checkbox"
                aria-label="Done"
                checked={t.done}
                onChange={() => toggleDone(t.id)}
              />
              Done
            </label>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length} of ${tasks.length}`}</p>
    </section>
  )
}
