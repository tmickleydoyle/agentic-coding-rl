'use client'
import { useState } from 'react'

interface Employee {
  id: number
  name: string
  department: string
}

interface Review {
  ratings: Record<string, number>
  comments: string
}

const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering' },
  { id: 2, name: 'Bob Martinez',  department: 'Marketing'   },
  { id: 3, name: 'Carol White',   department: 'Engineering' },
]

const CATEGORIES = ['Productivity', 'Communication', 'Teamwork', 'Innovation', 'Reliability']

function calcAvg(review: Review | undefined): string {
  if (!review) return 'Not reviewed'
  const vals = CATEGORIES.map(c => review.ratings[c]).filter(v => v !== undefined)
  if (vals.length === 0) return 'Not reviewed'
  const sum = vals.reduce((a, b) => a + b, 0)
  return (sum / vals.length).toFixed(1)
}

export default function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [reviews, setReviews] = useState<Record<number, Review>>({})
  const [draftRatings, setDraftRatings] = useState<Record<string, number>>({})
  const [draftComments, setDraftComments] = useState('')
  const [savedName, setSavedName] = useState<string | null>(null)

  function handleSelectEmployee(emp: Employee) {
    setSelectedId(emp.id)
    const existing = reviews[emp.id]
    setDraftRatings(existing ? { ...existing.ratings } : {})
    setDraftComments(existing ? existing.comments : '')
    setSavedName(null)
  }

  function handleRate(category: string, value: number) {
    setDraftRatings(prev => ({ ...prev, [category]: value }))
  }

  function handleSave() {
    if (selectedId === null) return
    if (CATEGORIES.some(c => !draftRatings[c])) return
    setReviews(prev => ({
      ...prev,
      [selectedId]: { ratings: { ...draftRatings }, comments: draftComments },
    }))
    const emp = EMPLOYEES.find(e => e.id === selectedId)
    setSavedName(emp ? emp.name : null)
  }

  const selectedEmp = EMPLOYEES.find(e => e.id === selectedId) || null

  return (
    <div>
      <h1>Performance Review</h1>

      <div>
        {EMPLOYEES.map(emp => (
          <button
            key={emp.id}
            data-testid="employee-tab"
            onClick={() => handleSelectEmployee(emp)}
            aria-pressed={selectedId === emp.id}
          >
            {emp.name}
          </button>
        ))}
      </div>

      {selectedEmp && (
        <div data-testid="review-form">
          <h2>{selectedEmp.name} — {selectedEmp.department}</h2>

          {CATEGORIES.map(cat => (
            <div key={cat} data-testid="category-row">
              <span>{cat}</span>
              {[1, 2, 3, 4, 5].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name={cat}
                    value={val}
                    checked={draftRatings[cat] === val}
                    onChange={() => handleRate(cat, val)}
                  />
                  {val}
                </label>
              ))}
            </div>
          ))}

          <textarea
            aria-label="Comments"
            value={draftComments}
            onChange={e => setDraftComments(e.target.value)}
          />

          <button data-testid="save-review" onClick={handleSave}>Save Review</button>

          {savedName && (
            <p data-testid="save-confirmation">Review saved for {savedName}</p>
          )}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Average Score</th>
          </tr>
        </thead>
        <tbody>
          {EMPLOYEES.map(emp => (
            <tr key={emp.id} data-testid="summary-row">
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td data-testid="summary-avg">{calcAvg(reviews[emp.id])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
