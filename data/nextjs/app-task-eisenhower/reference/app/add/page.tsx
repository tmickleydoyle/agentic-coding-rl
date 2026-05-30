'use client'
import { useState } from 'react'
import { useMatrix } from '../../components/MatrixProvider'

export default function AddPage() {
  const { addTask, navigate } = useMatrix()
  const [title, setTitle] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [important, setImportant] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addTask({ title: title.trim(), urgent, important })
    setTitle('')
    setUrgent(false)
    setImportant(false)
    navigate('matrix')
  }

  return (
    <section data-testid="page-add">
      <h1>Add task</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="urgent">Urgent</label>
        <input
          id="urgent"
          type="checkbox"
          data-testid="urgent-checkbox"
          checked={urgent}
          onChange={(e) => setUrgent(e.target.checked)}
        />
        <label htmlFor="important">Important</label>
        <input
          id="important"
          type="checkbox"
          data-testid="important-checkbox"
          checked={important}
          onChange={(e) => setImportant(e.target.checked)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-task">
          Add task
        </button>
      </form>
    </section>
  )
}
