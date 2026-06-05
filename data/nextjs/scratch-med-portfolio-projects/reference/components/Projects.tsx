'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category, Status } from '../lib/types'

const CATEGORIES: Category[] = ['Web', 'Mobile', 'Design']
const STATUSES: Status[] = ['Live', 'Draft']

export function Projects() {
  const { projects, addProject, toggleStatus, deleteProject } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Web')
  const [status, setStatus] = useState<Status>('Live')
  const [filter, setFilter] = useState<Category | 'All'>('All')

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const liveCount = projects.filter((p) => p.status === 'Live').length

  return (
    <section aria-label="Projects view">
      <h1>{`Projects (${visible.length})`}</h1>
      <p>{`Live: ${liveCount}`}</p>
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
      <select
        aria-label="Filter by category"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Category | 'All')}
      >
        <option value="All">All</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
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
