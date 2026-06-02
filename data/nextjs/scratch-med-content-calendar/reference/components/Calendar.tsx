'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, PostStatus } from '../lib/types'

const PLATFORMS: Platform[] = ['Twitter', 'Instagram', 'LinkedIn', 'Blog']
const STATUSES: PostStatus[] = ['Draft', 'Scheduled', 'Published']
const FILTER_OPTIONS = ['All', 'Draft', 'Scheduled', 'Published'] as const

export function Calendar() {
  const { posts, addPost, deletePost } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [status, setStatus] = useState<PostStatus>('Draft')
  const [filter, setFilter] = useState<string>('All')

  const filtered = filter === 'All' ? posts : posts.filter((p) => p.status === filter)
  const scheduledCount = posts.filter((p) => p.status === 'Scheduled').length

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
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
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
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${filtered.length} posts`}</p>
      <p>{`Scheduled: ${scheduledCount}`}</p>
      <ul>
        {filtered.map((post) => (
          <li key={post.id}>
            <span>{post.title}</span>
            <span>{post.platform}</span>
            <span>{post.status}</span>
            <button
              aria-label={`Delete ${post.title}`}
              onClick={() => deletePost(post.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
