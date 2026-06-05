'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

type FilterValue = 'all' | 'live' | 'draft'

export function Projects() {
  const { projects, addProject, toggleStatus, deleteProject } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const filtered =
    filter === 'all' ? projects : projects.filter((p) => p.status === filter)

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
      <input
        aria-label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        aria-label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button
        onClick={() => {
          addProject(title, category)
          setTitle('')
          setCategory('')
        }}
      >
        Add Project
      </button>
      <label>
        Filter by status
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterValue)}
        >
          <option value="all">all</option>
          <option value="live">live</option>
          <option value="draft">draft</option>
        </select>
      </label>
      <p>{`Showing: ${filtered.length} projects`}</p>
      <ul>
        {filtered.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.category}</span>
            <span>{p.status}</span>
            <button
              aria-label={p.status === 'draft' ? `Mark live ${p.title}` : `Mark draft ${p.title}`}
              onClick={() => toggleStatus(p.id)}
            >
              {p.status === 'draft' ? 'Mark live' : 'Mark draft'}
            </button>
            <button
              aria-label={`Delete ${p.title}`}
              onClick={() => deleteProject(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
