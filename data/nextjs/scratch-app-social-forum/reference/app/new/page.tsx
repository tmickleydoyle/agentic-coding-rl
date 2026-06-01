'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function NewThreadPage() {
  const { categories, addThread, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addThread({ title: title.trim(), categoryId })
    setTitle('')
    navigate('threads')
  }

  return (
    <section data-testid="page-new">
      <h1>New thread</h1>
      <form data-testid="new-thread-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-thread">
          Create thread
        </button>
      </form>
    </section>
  )
}
