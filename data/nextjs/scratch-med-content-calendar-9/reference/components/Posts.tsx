'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, PostStatus } from '../lib/types'

const PLATFORMS: Platform[] = ['Twitter', 'Instagram', 'LinkedIn']
const STATUSES: PostStatus[] = ['draft', 'scheduled', 'published']

export function Posts() {
  const { posts, addPost, deletePost, markPublished } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [status, setStatus] = useState<PostStatus>('draft')
  const [filter, setFilter] = useState<PostStatus | 'All'>('All')

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length
  const visible = filter === 'All' ? posts : posts.filter((p) => p.status === filter)

  return (
    <section aria-label="Posts view">
      <h1>Posts</h1>
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
          onChange={(e) => setFilter(e.target.value as PostStatus | 'All')}
        >
          <option value="All">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <p>{`Scheduled: ${scheduledCount}`}</p>
      <ul>
        {visible.map((post) => (
          <li key={post.id}>
            <span>{post.title}</span>
            <span>{post.platform}</span>
            <span>{post.status}</span>
            <button
              aria-label={`Mark Published ${post.title}`}
              disabled={post.status === 'published'}
              onClick={() => markPublished(post.id)}
            >
              Mark Published
            </button>
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
