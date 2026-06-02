'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

type Filter = 'All' | 'Live' | 'Draft'

export function Projects() {
  const { projects, addProject, publish, unpublish } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const liveCount = projects.filter((p) => p.status === 'live').length

  const visible = projects.filter((p) => {
    if (filter === 'Live') return p.status === 'live'
    if (filter === 'Draft') return p.status === 'draft'
    return true
  })

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
      <p>{`Live: ${liveCount}`}</p>
      <div>
        <input
          aria-label="Project title"
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
          Add project
        </button>
      </div>
      <label>
        Filter by status
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          <option value="All">All</option>
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
        </select>
      </label>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.category}</span>
            <span>{p.status}</span>
            {p.status === 'draft' && (
              <button aria-label={`Publish ${p.title}`} onClick={() => publish(p.id)}>
                Publish
              </button>
            )}
            {p.status === 'live' && (
              <button aria-label={`Unpublish ${p.title}`} onClick={() => unpublish(p.id)}>
                Unpublish
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
