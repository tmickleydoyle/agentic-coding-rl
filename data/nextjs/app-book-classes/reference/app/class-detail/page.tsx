'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useEnrollments } from '../../hooks/useEnrollments'

export default function ClassDetailPage() {
  const { classes, selectedClassId, enroll } = useApp()
  const { enrolledCount, isFull } = useEnrollments()
  const [student, setStudent] = useState('')
  const [error, setError] = useState('')

  const klass = classes.find((c) => c.id === selectedClassId) ?? null

  if (!klass) {
    return (
      <section data-testid="page-class-detail">
        <h1>Class</h1>
        <p data-testid="no-class">Pick a class first.</p>
      </section>
    )
  }

  const full = isFull(klass.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (student.trim().length === 0) {
      setError('Student is required')
      return
    }
    setError('')
    enroll(klass.id, student.trim())
    setStudent('')
  }

  return (
    <section data-testid="page-class-detail">
      <h1>Class</h1>
      <p data-testid="detail-name">{klass.name}</p>
      <p data-testid="detail-enrolled">{enrolledCount(klass.id)}</p>
      <p data-testid="detail-capacity">{klass.capacity}</p>
      {full ? <p data-testid="detail-full">Class is full — new sign-ups are waitlisted.</p> : null}
      <form data-testid="enroll-form" onSubmit={onSubmit}>
        <label htmlFor="student">Student</label>
        <input
          id="student"
          data-testid="student-input"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="enroll-submit">
          Enroll
        </button>
      </form>
    </section>
  )
}
