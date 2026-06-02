'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, Status } from '../lib/types'

const PLATFORMS: Platform[] = ['Twitter', 'Instagram', 'LinkedIn']
const STATUSES: Status[] = ['draft', 'scheduled', 'published']
const FILTERS: Array<'All' | Status> = ['All', 'draft', 'scheduled', 'published']

export function Posts() {
  const { posts, addPost, deletePost } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [status, setStatus] = useState<Status>('draft')
  const [filter, setFilter] = useState<'All' | Status>('All')

  const visible = filter === 'All' ? posts : posts.filter((p) => p.status === filter)

  return (
    <section aria-label="Posts view">
      <h1>{`Posts (${visible.length})`}</h1>
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
          {PLATFORMS.map((pl) => (
            <option key={pl} value={pl}>{pl}</option>
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
            addPost(title, platform, status)
            setTitle('')
          }}
        >
          Add Post
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | Status)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.platform}</span>
            <span>{p.status}</span>
            <button aria-label={`Delete ${p.title}`} onClick={() => deletePost(p.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
