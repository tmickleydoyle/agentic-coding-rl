'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, Status } from '../lib/types'

const PLATFORMS: Platform[] = ['Twitter', 'Instagram', 'LinkedIn', 'Blog']
const STATUSES: Status[] = ['Draft', 'Scheduled', 'Published']
const FILTERS = ['All', 'Draft', 'Scheduled', 'Published'] as const
type Filter = typeof FILTERS[number]

export function Calendar() {
  const { items, addItem, deleteItem, markPublished } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [status, setStatus] = useState<Status>('Draft')
  const [filter, setFilter] = useState<Filter>('All')

  const visible = filter === 'All' ? items : items.filter((i) => i.status === filter)

  return (
    <section aria-label="Calendar view">
      <h1>{`Content Items (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          aria-label="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addItem(title, platform, status)
            setTitle('')
          }}
        >
          Add item
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.platform}</span>
            <span>{item.status}</span>
            <button
              aria-label={`Mark ${item.title} Published`}
              disabled={item.status === 'Published'}
              onClick={() => markPublished(item.id)}
            >
              Mark Published
            </button>
            <button
              aria-label={`Delete ${item.title}`}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
