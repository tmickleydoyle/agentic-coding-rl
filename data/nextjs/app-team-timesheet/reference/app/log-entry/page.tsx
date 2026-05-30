'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { DAYS } from '../../lib/types'
import type { Day } from '../../lib/types'

export default function LogEntryPage() {
  const { projects, logHours, navigate } = useApp()
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [day, setDay] = useState<Day>(DAYS[0])
  const [hours, setHours] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(hours)
    if (hours.trim().length === 0 || Number.isNaN(value) || value <= 0) {
      setError('Enter a positive number of hours')
      return
    }
    setError('')
    logHours({ projectId, day, hours: value })
    setHours('')
    navigate('week')
  }

  return (
    <section data-testid="page-log-entry">
      <h1>Log hours</h1>
      <form data-testid="log-form" onSubmit={onSubmit}>
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

        <label htmlFor="day">Day</label>
        <select
          id="day"
          data-testid="day-select"
          value={day}
          onChange={(e) => setDay(e.target.value as Day)}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label htmlFor="hours">Hours</label>
        <input
          id="hours"
          type="number"
          data-testid="hours-input"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-log">
          Log
        </button>
      </form>
    </section>
  )
}
