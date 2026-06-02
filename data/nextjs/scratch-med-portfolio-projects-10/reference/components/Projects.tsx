'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category, Status } from '../lib/types'

export function Projects() {
  const { projects, filter, setFilter, addProject, deleteProject, toggleStatus } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Web')
  const [status, setStatus] = useState<Status>('Live')

  const visible = filter === 'All' ? projects : projects.filter((p) => p.status === filter)

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
      <div>
        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Design">Design</option>
          <option value="Other">Other</option>
        </select>
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
        </select>
        <button
          onClick={() => {
            addProject(title, category, status)
            setTitle('')
          }}
        >
          Add Project
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | 'Live' | 'Draft')}
        >
          <option value="All">All</option>
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
      <p>{`Showing: ${visible.length} projects`}</p>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.category}</span>
            <span>{p.status}</span>
            <button aria-label={`Toggle ${p.title}`} onClick={() => toggleStatus(p.id)}>
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
