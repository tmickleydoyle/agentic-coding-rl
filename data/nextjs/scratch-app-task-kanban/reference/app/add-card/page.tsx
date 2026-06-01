'use client'
import { useState } from 'react'
import { useBoard } from '../../components/BoardProvider'

export default function AddCardPage() {
  const { addCard, navigate } = useBoard()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addCard(title.trim())
    setTitle('')
    navigate('board')
  }

  return (
    <section data-testid="page-add-card">
      <h1>Add card</h1>
      <form data-testid="add-card-form" onSubmit={onSubmit}>
        <label htmlFor="card-title">Title</label>
        <input
          id="card-title"
          data-testid="card-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-card">
          Add card
        </button>
      </form>
    </section>
  )
}
