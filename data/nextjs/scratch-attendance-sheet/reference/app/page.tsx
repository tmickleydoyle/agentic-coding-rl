'use client'
import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

type Status = 'present' | 'absent'

interface Student {
  id: number
  name: string
  attendance: Status[]
}

const SEED: Student[] = [
  { id: 1, name: 'Alice Johnson', attendance: ['present', 'present', 'absent', 'present', 'present'] },
  { id: 2, name: 'Bob Smith',     attendance: ['absent', 'present', 'present', 'absent', 'present'] },
  { id: 3, name: 'Carol White',   attendance: ['present', 'absent', 'present', 'present', 'present'] },
  { id: 4, name: 'David Lee',     attendance: ['present', 'present', 'present', 'present', 'absent'] },
  { id: 5, name: 'Eve Adams',     attendance: ['absent', 'absent', 'absent', 'present', 'present'] },
]

export default function App() {
  const [students, setStudents] = useState<Student[]>(
    SEED.map(s => ({ ...s, attendance: [...s.attendance] as Status[] }))
  )
  const [newName, setNewName] = useState('')

  function toggleDay(studentId: number, dayIndex: number) {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s
        const updated = [...s.attendance] as Status[]
        updated[dayIndex] = updated[dayIndex] === 'present' ? 'absent' : 'present'
        return { ...s, attendance: updated }
      })
    )
  }

  function handleAddStudent() {
    if (!newName.trim()) return
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    const newStudent: Student = {
      id,
      name: newName.trim(),
      attendance: ['absent', 'absent', 'absent', 'absent', 'absent'],
    }
    setStudents(prev => [...prev, newStudent])
    setNewName('')
  }

  const totalPresent = students.reduce((sum, s) => sum + s.attendance.filter(a => a === 'present').length, 0)
  const totalAbsent = students.reduce((sum, s) => sum + s.attendance.filter(a => a === 'absent').length, 0)
  const totalDays = students.length * DAYS.length
  const classRate = totalDays === 0 ? 0 : Math.round((totalPresent / totalDays) * 100)

  return (
    <div>
      <h1>Attendance Sheet</h1>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            {DAYS.map(d => <th key={d}>{d}</th>)}
            <th>Present</th>
            <th>Absent</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const presentCount = s.attendance.filter(a => a === 'present').length
            const absentCount = s.attendance.filter(a => a === 'absent').length
            const rate = Math.round((presentCount / DAYS.length) * 100)
            return (
              <tr key={s.id} data-testid="attendance-row">
                <td data-testid="student-name">{s.name}</td>
                {DAYS.map((day, i) => (
                  <td key={day}>
                    <button
                      data-testid={`day-${day}-${s.id}`}
                      onClick={() => toggleDay(s.id, i)}
                    >
                      {s.attendance[i]}
                    </button>
                  </td>
                ))}
                <td data-testid="present-count">{presentCount}</td>
                <td data-testid="absent-count">{absentCount}</td>
                <td data-testid="attendance-rate">{rate}%</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>Totals</td>
            <td data-testid="total-present">{totalPresent}</td>
            <td data-testid="total-absent">{totalAbsent}</td>
            <td data-testid="class-rate">{classRate}%</td>
          </tr>
        </tfoot>
      </table>

      <section>
        <h2>Add Student</h2>
        <label htmlFor="new-student-name">New Student Name</label>
        <input
          id="new-student-name"
          aria-label="New Student Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </section>
    </div>
  )
}
