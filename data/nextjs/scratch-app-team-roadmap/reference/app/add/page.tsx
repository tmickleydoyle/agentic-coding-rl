'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddPage() {
  const { quarters, addInitiative, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [quarterId, setQuarterId] = useState(quarters[0]?.id ?? '')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addInitiative({ title: title.trim(), quarterId })
    setTitle('')
    navigate('roadmap')
  }

  return (
    <section data-testid="page-add">
      <h1>Add initiative</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="quarter">Quarter</label>
        <select
          id="quarter"
          data-testid="quarter-select"
          value={quarterId}
          onChange={(e) => setQuarterId(e.target.value)}
        >
          {quarters.map((q) => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-initiative">
          Add
        </button>
      </form>
    </section>
  )
}
