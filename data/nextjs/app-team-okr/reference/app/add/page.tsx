'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddPage() {
  const { addObjective, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addObjective({ title: title.trim(), owner: owner.trim() })
    setTitle('')
    setOwner('')
    navigate('objectives')
  }

  return (
    <section data-testid="page-add">
      <h1>Add objective</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          data-testid="owner-input"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-objective">
          Add
        </button>
      </form>
    </section>
  )
}
