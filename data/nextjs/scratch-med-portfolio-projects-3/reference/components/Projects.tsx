'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Web', 'Mobile', 'Design', 'Other']

export function Projects() {
  const { projects, filter, setFilter, addProject, toggleStatus, deleteProject } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Web')

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const total = projects.length
  const shown = visible.length

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
      <p>{`Showing: ${shown} of ${total}`}</p>
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
      <button
        onClick={() => {
          addProject(title, category)
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
            <button
              aria-label={p.status === 'Live' ? `Unpublish ${p.title}` : `Publish ${p.title}`}
              onClick={() => toggleStatus(p.id)}
            >
              {p.status === 'Live' ? 'Unpublish' : 'Publish'}
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
