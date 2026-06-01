'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AssignmentsPage() {
  const { assignments, addAssignment } = useApp()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addAssignment(title.trim())
    setTitle('')
  }

  return (
    <section data-testid="page-assignments">
      <h1>Assignments</h1>
      <ul data-testid="assignment-list">
        {assignments.map((a) => (
          <li key={a.id} data-testid={`assignment-${a.id}`}>
            <span data-testid={`assignment-${a.id}-title`}>{a.title}</span>
          </li>
        ))}
      </ul>
      <form data-testid="add-assignment-form" onSubmit={onSubmit}>
        <input
          data-testid="assignment-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error ? <p data-testid="assignment-error">{error}</p> : null}
        <button type="submit" data-testid="add-assignment">
          Add assignment
        </button>
      </form>
    </section>
  )
}
