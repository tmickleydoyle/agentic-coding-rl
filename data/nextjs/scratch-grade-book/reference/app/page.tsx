'use client'
import { useState } from 'react'

interface Student {
  id: number
  name: string
  math: number
  science: number
  english: number
}

const SEED: Student[] = [
  { id: 1, name: 'Alice', math: 92, science: 85, english: 78 },
  { id: 2, name: 'Bob', math: 76, science: 90, english: 88 },
  { id: 3, name: 'Carol', math: 88, science: 72, english: 95 },
]

function avg3(a: number, b: number, c: number): number {
  return (a + b + c) / 3
}

function classAvg(students: Student[], key: keyof Omit<Student, 'id' | 'name'>): number {
  if (students.length === 0) return 0
  return students.reduce((s, st) => s + st[key], 0) / students.length
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(SEED.map(s => ({ ...s })))
  const [name, setName] = useState('')
  const [math, setMath] = useState('')
  const [science, setScienc] = useState('')
  const [english, setEnglish] = useState('')

  function addStudent() {
    const m = parseFloat(math)
    const sc = parseFloat(science)
    const en = parseFloat(english)
    if (
      !name.trim() ||
      !isFinite(m) || m < 0 || m > 100 ||
      !isFinite(sc) || sc < 0 || sc > 100 ||
      !isFinite(en) || en < 0 || en > 100
    ) return
    setStudents(prev => [
      ...prev,
      { id: prev.length + 1, name: name.trim(), math: m, science: sc, english: en },
    ])
    setName('')
    setMath('')
    setScienc('')
    setEnglish('')
  }

  const mathAvg = classAvg(students, 'math')
  const scienceAvg = classAvg(students, 'science')
  const englishAvg = classAvg(students, 'english')

  return (
    <div>
      <h1>Grade Book</h1>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Math</th>
            <th>Science</th>
            <th>English</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          {students.map(st => (
            <tr key={st.id} data-testid="student-row">
              <td>{st.name}</td>
              <td>{st.math}</td>
              <td>{st.science}</td>
              <td>{st.english}</td>
              <td data-testid="student-avg">{avg3(st.math, st.science, st.english).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <p data-testid="class-avg-math">Math Avg: {mathAvg.toFixed(1)}</p>
        <p data-testid="class-avg-science">Science Avg: {scienceAvg.toFixed(1)}</p>
        <p data-testid="class-avg-english">English Avg: {englishAvg.toFixed(1)}</p>
      </div>

      <div>
        <h2>Add Student</h2>
        <label>
          Student Name
          <input
            aria-label="Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label>
          Math Grade
          <input
            aria-label="Math Grade"
            type="number"
            value={math}
            onChange={e => setMath(e.target.value)}
          />
        </label>
        <label>
          Science Grade
          <input
            aria-label="Science Grade"
            type="number"
            value={science}
            onChange={e => setScienc(e.target.value)}
          />
        </label>
        <label>
          English Grade
          <input
            aria-label="English Grade"
            type="number"
            value={english}
            onChange={e => setEnglish(e.target.value)}
          />
        </label>
        <button onClick={addStudent}>Add Student</button>
      </div>
    </div>
  )
}
