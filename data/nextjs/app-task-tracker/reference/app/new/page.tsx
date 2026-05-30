'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function NewTaskPage() {
  const { projects, addTask, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addTask({
      title: title.trim(),
      projectId,
      dueDate: dueDate.length > 0 ? dueDate : null,
    })
    setTitle('')
    setDueDate('')
    navigate('tasks')
  }

  return (
    <section data-testid="page-new">
      <h1>New task</h1>
      <form data-testid="new-task-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="project">Project</label>
        <select
          id="project"
          data-testid="project-select"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <label htmlFor="due">Due date</label>
        <input
          id="due"
          type="date"
          data-testid="due-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-task">
          Add task
        </button>
      </form>
    </section>
  )
}
