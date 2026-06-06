'use client'
import { useState } from 'react'

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  featured: boolean
}

const SEED: Project[] = [
  { id: 1, title: 'Neon City', description: 'A vibrant digital cityscape', tags: ['digital', 'neon'], featured: true },
  { id: 2, title: 'Forest Sounds', description: 'Ambient audio installation', tags: ['audio', 'nature'], featured: false },
  { id: 3, title: 'Paper Worlds', description: 'Hand-crafted paper dioramas', tags: ['craft', 'paper'], featured: true },
  { id: 4, title: 'Data Portraits', description: 'Generative art from personal data', tags: ['generative', 'data'], featured: false },
]

export default function App() {
  const [projects, setProjects] = useState<Project[]>(SEED.map(x => ({ ...x, tags: [...x.tags] })))
  const [filterText, setFilterText] = useState('')
  const [filterFeatured, setFilterFeatured] = useState(false)

  const [inputTitle, setInputTitle] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [inputTags, setInputTags] = useState('')
  const [inputFeatured, setInputFeatured] = useState(false)
  const [formError, setFormError] = useState(false)

  const nextId = () => Math.max(0, ...projects.map(p => p.id)) + 1

  const filtered = projects.filter(p => {
    const matchText = p.title.toLowerCase().includes(filterText.toLowerCase())
    const matchFeatured = filterFeatured ? p.featured : true
    return matchText && matchFeatured
  })

  const handleToggleFeatured = (id: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p))
  }

  const handleDelete = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputTitle.trim() || !inputDescription.trim()) {
      setFormError(true)
      return
    }
    setFormError(false)
    const tags = inputTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    const newProject: Project = {
      id: nextId(),
      title: inputTitle.trim(),
      description: inputDescription.trim(),
      tags,
      featured: inputFeatured,
    }
    setProjects(prev => [...prev, newProject])
    setInputTitle('')
    setInputDescription('')
    setInputTags('')
    setInputFeatured(false)
  }

  return (
    <div>
      <h1>Project Gallery</h1>
      <span data-testid="project-count">{projects.length} projects</span>

      <div>
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Search by title"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <label>
          <input
            data-testid="filter-featured"
            type="checkbox"
            checked={filterFeatured}
            onChange={e => setFilterFeatured(e.target.checked)}
          />
          Featured Only
        </label>
      </div>

      <div>
        {filtered.map(p => (
          <div key={p.id} data-testid="project-card">
            <span data-testid="project-title">{p.title}</span>
            <span data-testid="project-description">{p.description}</span>
            <span data-testid="project-tags">{p.tags.join(',')}</span>
            <span data-testid="project-featured">{p.featured ? 'Featured' : 'Standard'}</span>
            <button
              data-testid="toggle-featured"
              onClick={() => handleToggleFeatured(p.id)}
            >
              {p.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              data-testid="delete-project"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-title"
          type="text"
          placeholder="Title"
          value={inputTitle}
          onChange={e => setInputTitle(e.target.value)}
        />
        <input
          data-testid="input-description"
          type="text"
          placeholder="Description"
          value={inputDescription}
          onChange={e => setInputDescription(e.target.value)}
        />
        <input
          data-testid="input-tags"
          type="text"
          placeholder="Tags (comma-separated)"
          value={inputTags}
          onChange={e => setInputTags(e.target.value)}
        />
        <label>
          <input
            data-testid="input-featured"
            type="checkbox"
            checked={inputFeatured}
            onChange={e => setInputFeatured(e.target.checked)}
          />
          Featured
        </label>
        <button data-testid="submit-project" type="submit">Add Project</button>
        {formError && (
          <span data-testid="form-error">Title and description are required.</span>
        )}
      </form>
    </div>
  )
}
