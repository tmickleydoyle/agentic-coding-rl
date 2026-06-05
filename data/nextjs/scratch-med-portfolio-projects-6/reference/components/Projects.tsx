'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Projects() {
  const { projects, filter, addProject, toggleStatus, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')

  const visible = filter === 'live' ? projects.filter((p) => p.status === 'live') : projects

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
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
      <div>
        <button
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          All
        </button>
        <button
          onClick={() => setFilter('live')}
          aria-pressed={filter === 'live'}
        >
          Live only
        </button>
      </div>
      <p>{`Showing: ${visible.length} projects`}</p>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>{p.category}</span>
            <span>{p.status}</span>
            <button onClick={() => toggleStatus(p.id)}>Toggle status</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
