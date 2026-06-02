'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Web', 'Mobile', 'Design', 'Other']

export function Projects() {
  const { projects, addProject, toggleStatus } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Web')
  const [filter, setFilter] = useState<Category | 'All'>('All')

  const liveCount = projects.filter((p) => p.status === 'live').length
  const displayed = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

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
        <button
          onClick={() => {
            addProject(title, category)
            setTitle('')
          }}
        >
          Add project
        </button>
      </div>
      <div>
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
      </div>
      <p>{`Live projects: ${liveCount}`}</p>
      <ul>
        {displayed.map((proj) => (
          <li key={proj.id}>
            <span>{proj.title}</span>
            <span>{proj.category}</span>
            <button
              aria-label={proj.status === 'live' ? `Unpublish ${proj.title}` : `Publish ${proj.title}`}
              onClick={() => toggleStatus(proj.id)}
            >
              {proj.status === 'live' ? 'Unpublish' : 'Publish'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
