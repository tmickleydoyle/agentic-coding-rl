'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Category } from '../../lib/types'

export function CategoriesPage() {
  const { triggerRefresh } = useApp()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function load() { fetch('/api/categories').then(r => r.json()).then(setCategories) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    setName(''); setDescription('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Categories</h1>
      <form data-testid="add-category-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-category-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-category-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <button data-testid="btn-add-category" type="submit">Add Category</button>
      </form>
      <ul data-testid="category-list" style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(c => (
          <li key={c.id} data-testid="category-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="category-name" style={{ fontWeight: 'bold' }}>{c.name}</span>
            {' — '}
            <span data-testid="category-description">{c.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
