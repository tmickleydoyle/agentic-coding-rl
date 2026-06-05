'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Platform, PostStatus } from '../lib/types'

export function Posts() {
  const { posts, filter, setFilter, addPost, deletePost, toggleStatus } = useApp()
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('Twitter')
  const [status, setStatus] = useState<PostStatus>('draft')

  const visible = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  return (
    <section aria-label="Posts view">
      <h1>Posts</h1>
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
        <option value="Twitter">Twitter</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Instagram">Instagram</option>
      </select>
      <select
        aria-label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as PostStatus)}
      >
        <option value="draft">draft</option>
        <option value="scheduled">scheduled</option>
        <option value="published">published</option>
      </select>
      <button
        onClick={() => {
          addPost(title, platform, status)
          setTitle('')
        }}
      >
        Add Post
      </button>
      <select
        aria-label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value as PostStatus | 'all')}
      >
        <option value="all">all</option>
        <option value="draft">draft</option>
        <option value="scheduled">scheduled</option>
        <option value="published">published</option>
      </select>
      <p>{`Showing: ${visible.length} post(s)`}</p>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.platform}</span>
            <span>{p.status}</span>
            <button aria-label={`Toggle status ${p.title}`} onClick={() => toggleStatus(p.id)}>
              Toggle status
            </button>
            <button aria-label={`Delete ${p.title}`} onClick={() => deletePost(p.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
