'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

const PRIORITIES: Priority[] = ['P0', 'P1', 'P2']
const STATUSES: Status[] = ['idea', 'building', 'shipped']

export function BacklogView() {
  const { features, addFeature, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('P1')
  const [filter, setFilter] = useState<Priority | 'All'>('All')

  const countForPriority = (p: Priority) => features.filter((f) => f.priority === p).length

  const visible = filter === 'All' ? features : features.filter((f) => f.priority === filter)

  return (
    <section aria-label="Backlog view">
      <h1>Backlog</h1>
      <div>
        {PRIORITIES.map((p) => (
          <span key={p}>{`${p} (${countForPriority(p)})`}</span>
        ))}
      </div>
      <div>
        <input
          aria-label="Feature title"
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
            addFeature(title, priority)
            setTitle('')
          }}
        >
          Add feature
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
        {visible.map((f) => (
          <li key={f.id}>
            <span>{f.title}</span>
            <span>{f.priority}</span>
            <select
              aria-label={`Status of ${f.title}`}
              value={f.status}
              onChange={(e) => setStatus(f.id, e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}
