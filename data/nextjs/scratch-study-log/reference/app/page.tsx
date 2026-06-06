'use client'
import { useState } from 'react'

interface Session {
  id: number
  subject: string
  topic: string
  date: string
  duration: number
  rating: number
}

const SEED: Session[] = [
  { id: 1, subject: 'Math',    topic: 'Derivatives',         date: '2024-02-05', duration: 45, rating: 4 },
  { id: 2, subject: 'Science', topic: "Newton's Laws",        date: '2024-02-05', duration: 60, rating: 5 },
  { id: 3, subject: 'English', topic: 'Shakespeare Sonnets',  date: '2024-02-06', duration: 30, rating: 3 },
  { id: 4, subject: 'Math',    topic: 'Integrals',            date: '2024-02-06', duration: 90, rating: 5 },
  { id: 5, subject: 'History', topic: 'The Renaissance',      date: '2024-02-07', duration: 50, rating: 3 },
  { id: 6, subject: 'Science', topic: 'Thermodynamics',       date: '2024-02-07', duration: 75, rating: 4 },
]

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED.map(s => ({ ...s })))
  const [newSubject, setNewSubject] = useState('')
  const [newTopic, setNewTopic] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const [newRating, setNewRating] = useState('')

  function handleAdd() {
    if (!newSubject.trim() || !newTopic.trim()) return
    const id = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1
    setSessions(prev => [...prev, {
      id,
      subject: newSubject.trim(),
      topic: newTopic.trim(),
      date: newDate,
      duration: Number(newDuration),
      rating: Number(newRating),
    }])
    setNewSubject('')
    setNewTopic('')
    setNewDate('')
    setNewDuration('')
    setNewRating('')
  }

  function handleDelete(id: number) {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const sorted = [...sessions].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    return b.id - a.id
  })

  // Subject summary
  const subjectMap: Record<string, { count: number; minutes: number; ratingSum: number }> = {}
  sessions.forEach(s => {
    if (!subjectMap[s.subject]) subjectMap[s.subject] = { count: 0, minutes: 0, ratingSum: 0 }
    subjectMap[s.subject].count += 1
    subjectMap[s.subject].minutes += s.duration
    subjectMap[s.subject].ratingSum += s.rating
  })
  const subjectRows = Object.keys(subjectMap).sort((a, b) => a.localeCompare(b))

  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const avgRating = totalSessions === 0
    ? 0
    : sessions.reduce((sum, s) => sum + s.rating, 0) / totalSessions

  return (
    <div>
      <h1>Study Log</h1>

      <section>
        <h2>Log a Session</h2>
        <label htmlFor="new-subject">Subject</label>
        <input
          id="new-subject"
          aria-label="Subject"
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
        />
        <label htmlFor="new-topic">Topic</label>
        <input
          id="new-topic"
          aria-label="Topic"
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
        />
        <label htmlFor="new-date">Date</label>
        <input
          id="new-date"
          aria-label="Date"
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
        />
        <label htmlFor="new-duration">Duration (minutes)</label>
        <input
          id="new-duration"
          aria-label="Duration (minutes)"
          type="number"
          min={1}
          value={newDuration}
          onChange={e => setNewDuration(e.target.value)}
        />
        <label htmlFor="new-rating">Rating</label>
        <input
          id="new-rating"
          aria-label="Rating"
          type="number"
          min={1}
          max={5}
          value={newRating}
          onChange={e => setNewRating(e.target.value)}
        />
        <button onClick={handleAdd}>Log Session</button>
      </section>

      <ul>
        {sorted.map(s => (
          <li key={s.id} data-testid="session-item">
            <span data-testid="session-subject">{s.subject}</span>
            <span data-testid="session-topic">{s.topic}</span>
            <span data-testid="session-date">{s.date}</span>
            <span data-testid="session-duration">{s.duration}</span>
            <span data-testid="session-rating">{s.rating}</span>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <section>
        <h2>Subject Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Sessions</th>
              <th>Total Minutes</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {subjectRows.map(subject => {
              const data = subjectMap[subject]
              return (
                <tr key={subject} data-testid="subject-row">
                  <td data-testid="subject-name">{subject}</td>
                  <td data-testid="subject-sessions">{data.count}</td>
                  <td data-testid="subject-minutes">{data.minutes}</td>
                  <td data-testid="subject-avg-rating">{(data.ratingSum / data.count).toFixed(1)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Overall Stats</h2>
        <p>Total Sessions: <span data-testid="total-sessions">{totalSessions}</span></p>
        <p>Total Minutes: <span data-testid="total-minutes">{totalMinutes}</span></p>
        <p>Average Rating: <span data-testid="avg-rating">{avgRating.toFixed(1)}</span></p>
      </section>
    </div>
  )
}
