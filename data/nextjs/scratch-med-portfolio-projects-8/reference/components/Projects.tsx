'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category, Status } from '../lib/types'

const CATEGORIES: Category[] = ['Web', 'Mobile', 'Design', 'Other']
const STATUSES: Status[] = ['Live', 'Draft']

export function Projects() {
  const { projects, addProject, deleteProject, toggleStatus } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Web')
  const [status, setStatus] = useState<Status>('Live')
  const [filter, setFilter] = useState<'All' | Status>('All')

  const liveCount = projects.filter((p) => p.status === 'Live').length
  const visible = filter === 'All' ? projects : projects.filter((p) => p.status === filter)

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
      <div>
        <input
          aria-label="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
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
            addProject(title, category, status)
            setTitle('')
          }}
        >
          Add project
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | Status)}
        >
          <option value="All">All</option>
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
      <p>{`Live projects: ${liveCount}`}</p>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.category}</span>
            <span>{p.status}</span>
            <button aria-label={`Toggle status ${p.title}`} onClick={() => toggleStatus(p.id)}>
              Toggle status
            </button>
            <button aria-label={`Delete ${p.title}`} onClick={() => deleteProject(p.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
