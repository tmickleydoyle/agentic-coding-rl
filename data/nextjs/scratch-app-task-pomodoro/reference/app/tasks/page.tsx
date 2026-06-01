'use client'
import { useState } from 'react'
import { usePomodoro } from '../../components/PomodoroProvider'
import TaskRow from '../../components/TaskRow'

export default function TasksPage() {
  const { tasks, addTask, removeTask, toggleDone, selectTask, navigate } = usePomodoro()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addTask(title.trim())
    setTitle('')
  }

  const onFocus = (id: string) => {
    selectTask(id)
    navigate('focus')
  }

  return (
    <section data-testid="page-tasks">
      <h1>Tasks</h1>
      <form data-testid="add-task-form" onSubmit={onSubmit}>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          data-testid="task-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-task">
          Add task
        </button>
      </form>
      <ul data-testid="task-list">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            onFocus={onFocus}
            onToggleDone={toggleDone}
            onRemove={removeTask}
          />
        ))}
      </ul>
    </section>
  )
}
