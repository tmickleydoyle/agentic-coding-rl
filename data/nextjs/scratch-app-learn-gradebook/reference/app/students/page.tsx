'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import StudentRow from '../../components/StudentRow'

export default function StudentsPage() {
  const { students, addStudent } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addStudent(name.trim())
    setName('')
  }

  return (
    <section data-testid="page-students">
      <h1>Students</h1>
      <ul data-testid="student-list">
        {students.map((s) => (
          <StudentRow key={s.id} student={s} />
        ))}
      </ul>
      <form data-testid="add-student-form" onSubmit={onSubmit}>
        <input
          data-testid="student-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p data-testid="student-error">{error}</p> : null}
        <button type="submit" data-testid="add-student">
          Add student
        </button>
      </form>
    </section>
  )
}
