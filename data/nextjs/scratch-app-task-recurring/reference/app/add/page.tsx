'use client'
import { useState } from 'react'
import { useRecurring } from '../../components/RecurringProvider'
import type { Schedule } from '../../lib/types'

export default function AddPage() {
  const { addTask, navigate } = useRecurring()
  const [title, setTitle] = useState('')
  const [schedule, setSchedule] = useState<Schedule>('daily')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addTask({ title: title.trim(), schedule })
    setTitle('')
    navigate('all-tasks')
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
        <label htmlFor="schedule">Schedule</label>
        <select
          id="schedule"
          data-testid="schedule-select"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value as Schedule)}
        >
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-task">
          Add task
        </button>
      </form>
    </section>
  )
}
