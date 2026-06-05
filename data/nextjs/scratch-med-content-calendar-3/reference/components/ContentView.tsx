'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, Status } from '../lib/types'

const PLATFORMS: Platform[] = ['Twitter', 'Instagram', 'LinkedIn']
const STATUSES: Status[] = ['draft', 'scheduled', 'published']

export function ContentView() {
  const { items, addItem, deleteItem, updateStatus } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [status, setStatus] = useState<Status>('draft')
  const [filter, setFilter] = useState<'all' | Status>('all')

  const visible = filter === 'all' ? items : items.filter((x) => x.status === filter)

  return (
    <section aria-label="Content view">
      <h1>{`Content (${visible.length})`}</h1>
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
          onChange={(e) => setFilter(e.target.value as 'all' | Status)}
        >
          <option value="all">all</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.platform}</span>
            <select
              aria-label={`Status for ${item.title}`}
              value={item.status}
              onChange={(e) => updateStatus(item.id, e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button aria-label={`Delete ${item.title}`} onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
