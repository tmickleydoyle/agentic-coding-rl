'use client'
import { useState } from 'react'

interface Student {
  id: number
  name: string
  grades: number[]
}

const SEED: Student[] = [
  { id: 1, name: 'Alice Johnson', grades: [92, 88, 95] },
  { id: 2, name: 'Bob Smith', grades: [78, 82, 70] },
  { id: 3, name: 'Carol White', grades: [65, 71, 60] },
  { id: 4, name: 'David Lee', grades: [100, 98, 99] },
]

function avg(grades: number[]): number {
  if (grades.length === 0) return 0
  return grades.reduce((a, b) => a + b, 0) / grades.length
}

function letterGrade(average: number): string {
  if (average >= 90) return 'A'
  if (average >= 80) return 'B'
  if (average >= 70) return 'C'
  if (average >= 60) return 'D'
  return 'F'
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(SEED.map(s => ({ ...s, grades: [...s.grades] })))
  const [newName, setNewName] = useState('')
  const [newGrade, setNewGrade] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [addGrade, setAddGrade] = useState('')

  function handleAddStudent() {
    if (!newName.trim() || newGrade === '') return
    const grade = Number(newGrade)
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    setStudents(prev => [...prev, { id, name: newName.trim(), grades: [grade] }])
    setNewName('')
    setNewGrade('')
  }

  function handleAddGrade() {
    if (!selectedStudent || addGrade === '') return
    const grade = Number(addGrade)
    setStudents(prev =>
      prev.map(s => s.name === selectedStudent ? { ...s, grades: [...s.grades, grade] } : s)
    )
    setAddGrade('')
  }

  const classAvg = students.length === 0
    ? 0
    : students.reduce((sum, s) => sum + avg(s.grades), 0) / students.length

  const topStudent = students.length === 0
    ? ''
    : students.reduce((best, s) => avg(s.grades) > avg(best.grades) ? s : best, students[0]).name

  return (
    <div>
      <h1>Class Grades Tracker</h1>

      <section>
        <h2>Add Student</h2>
        <label htmlFor="student-name-input">Student Name</label>
        <input
          id="student-name-input"
          aria-label="Student Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <label htmlFor="grade-input">Grade</label>
        <input
          id="grade-input"
          aria-label="Grade"
          type="number"
          min={0}
          max={100}
          value={newGrade}
          onChange={e => setNewGrade(e.target.value)}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </section>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Grades</th>
            <th>Average</th>
            <th>Letter Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const average = avg(s.grades)
            return (
              <tr key={s.id} data-testid="student-row">
                <td data-testid="student-name">{s.name}</td>
                <td data-testid="student-grades">{s.grades.join(', ')}</td>
                <td data-testid="student-avg">{average.toFixed(1)}</td>
                <td data-testid="student-letter">{letterGrade(average)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <section>
        <h2>Add Grade to Student</h2>
        <label htmlFor="select-student">Select Student</label>
        <select
          id="select-student"
          aria-label="Select Student"
          value={selectedStudent}
          onChange={e => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select --</option>
          {students.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
        <label htmlFor="new-grade-input">New Grade</label>
        <input
          id="new-grade-input"
          aria-label="New Grade"
          type="number"
          min={0}
          max={100}
          value={addGrade}
          onChange={e => setAddGrade(e.target.value)}
        />
        <button onClick={handleAddGrade}>Add Grade</button>
      </section>

      <section>
        <h2>Class Summary</h2>
        <p>Class Average: <span data-testid="class-avg">{classAvg.toFixed(1)}</span></p>
        <p>Top Student: <span data-testid="top-student">{topStudent}</span></p>
      </section>
    </div>
  )
}
