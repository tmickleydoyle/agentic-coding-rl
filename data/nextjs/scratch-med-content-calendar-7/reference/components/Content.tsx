'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, Status } from '../lib/types'

const PLATFORMS: Platform[] = ['Blog', 'Twitter', 'Instagram', 'LinkedIn']
const STATUSES: Status[] = ['draft', 'scheduled', 'published']
const FILTER_OPTIONS = ['all', 'draft', 'scheduled', 'published'] as const

export function Content() {
  const { items, addItem, deleteItem } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Blog')
  const [status, setStatus] = useState<Status>('draft')
  const [filter, setFilter] = useState<'all' | Status>('all')

  const visible = filter === 'all' ? items : items.filter((x) => x.status === filter)

  return (
    <section aria-label="Content view">
      <h1>Content</h1>
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
          {FILTER_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
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
            <button aria-label={`Delete ${item.title}`} onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
