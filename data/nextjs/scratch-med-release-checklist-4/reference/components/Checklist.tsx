'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

export function Checklist() {
  const { tasks, addTask, toggleDone } = useApp()
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const total = tasks.length
  const completed = tasks.filter((t) => t.done).length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  const visible = tasks.filter((t) => {
    if (filter === 'Pending') return !t.done
    if (filter === 'Completed') return t.done
    return true
  })

  return (
    <section aria-label="Checklist view">
      <h1>{`Completion: ${pct}%`}</h1>
      <div>
        <input
          aria-label="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <button
          onClick={() => {
            addTask(name, owner)
            setName('')
            setOwner('')
          }}
        >
          Add task
        </button>
      </div>
      <div>
        {(['All', 'Pending', 'Completed'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>
            {f}
          </button>
        ))}
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{t.owner}</span>
            <label>
              <input
                type="checkbox"
                aria-label={`Done: ${t.name}`}
                checked={t.done}
                onChange={() => toggleDone(t.id)}
              />
              Done
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
