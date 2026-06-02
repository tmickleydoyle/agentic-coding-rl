'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ContentStatus, Platform } from '../lib/types'

const PLATFORMS: Platform[] = ['Twitter', 'Instagram', 'LinkedIn', 'Blog']
const STATUS_FILTERS: ['All', ...ContentStatus[]] = ['All', 'draft', 'scheduled', 'published']

export function Calendar() {
  const { items, addItem, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [filter, setFilter] = useState<'All' | ContentStatus>('All')

  const visible = filter === 'All' ? items : items.filter((i) => i.status === filter)

  return (
    <section aria-label="Calendar view">
      <h1>Calendar</h1>
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
        <button
          onClick={() => {
            addItem(title, platform)
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
          onChange={(e) => setFilter(e.target.value as 'All' | ContentStatus)}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length} items`}</p>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.platform}</span>
            <span>{item.status}</span>
            <button onClick={() => setStatus(item.id, 'draft')}>Set draft</button>
            <button onClick={() => setStatus(item.id, 'scheduled')}>Set scheduled</button>
            <button onClick={() => setStatus(item.id, 'published')}>Set published</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
