'use client'
import { useState } from 'react'

interface Exam {
  id: number
  subject: string
  title: string
  examDate: string
  notes: string
}

const REFERENCE_DATE = new Date('2024-02-09')

const SEED: Exam[] = [
  { id: 1, subject: 'Math',             title: 'Calculus Final',        examDate: '2024-02-16', notes: 'Chapters 1-8' },
  { id: 2, subject: 'Science',          title: 'Physics Midterm',       examDate: '2024-02-12', notes: 'Lab practicals included' },
  { id: 3, subject: 'English',          title: 'Literature Essay Exam', examDate: '2024-02-20', notes: 'Open book' },
  { id: 4, subject: 'History',          title: 'World War II Test',     examDate: '2024-02-09', notes: 'Multiple choice' },
  { id: 5, subject: 'Computer Science', title: 'Algorithm Quiz',        examDate: '2024-02-14', notes: 'Sorting and graphs' },
]

function daysRemaining(examDate: string): number {
  const exam = new Date(examDate)
  const diff = exam.getTime() - REFERENCE_DATE.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export default function App() {
  const [exams, setExams] = useState<Exam[]>(SEED.map(e => ({ ...e })))
  const [sortBy, setSortBy] = useState('Date')
  const [newSubject, setNewSubject] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newNotes, setNewNotes] = useState('')

  function handleAdd() {
    if (!newSubject.trim() || !newTitle.trim()) return
    const id = exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1
    setExams(prev => [...prev, {
      id,
      subject: newSubject.trim(),
      title: newTitle.trim(),
      examDate: newDate,
      notes: newNotes.trim(),
    }])
    setNewSubject('')
    setNewTitle('')
    setNewDate('')
    setNewNotes('')
  }

  function handleRemove(id: number) {
    setExams(prev => prev.filter(e => e.id !== id))
  }

  const sorted = [...exams].sort((a, b) => {
    if (sortBy === 'Date') return a.examDate.localeCompare(b.examDate)
    if (sortBy === 'Subject') return a.subject.toLowerCase().localeCompare(b.subject.toLowerCase())
    if (sortBy === 'Days Remaining') return daysRemaining(a.examDate) - daysRemaining(b.examDate)
    return 0
  })

  const examCount = exams.length

  let nextExamTitle = 'None'
  if (exams.length > 0) {
    const withDays = exams.map(e => ({ ...e, days: daysRemaining(e.examDate) }))
    const upcoming = withDays.filter(e => e.days >= 0)
    if (upcoming.length > 0) {
      nextExamTitle = upcoming.reduce((best, e) => e.days < best.days ? e : best, upcoming[0]).title
    } else {
      nextExamTitle = withDays.reduce((best, e) => e.days > best.days ? e : best, withDays[0]).title
    }
  }

  return (
    <div>
      <h1>Exam Countdown</h1>

      <section>
        <label htmlFor="sort-select">Sort by</label>
        <select
          id="sort-select"
          aria-label="Sort by"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option>Date</option>
          <option>Subject</option>
          <option>Days Remaining</option>
        </select>
      </section>

      <div>
        {sorted.map(exam => (
          <div key={exam.id} data-testid="exam-card">
            <span data-testid="exam-subject">{exam.subject}</span>
            <span data-testid="exam-title">{exam.title}</span>
            <span data-testid="exam-date">{exam.examDate}</span>
            <span data-testid="exam-days">{daysRemaining(exam.examDate)}</span>
            <span data-testid="exam-notes">{exam.notes}</span>
            <button onClick={() => handleRemove(exam.id)}>Remove</button>
          </div>
        ))}
      </div>

      <section>
        <h2>Add Exam</h2>
        <label htmlFor="new-subject">Subject</label>
        <input
          id="new-subject"
          aria-label="Subject"
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
        />
        <label htmlFor="new-title">Title</label>
        <input
          id="new-title"
          aria-label="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <label htmlFor="new-date">Exam Date</label>
        <input
          id="new-date"
          aria-label="Exam Date"
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
        />
        <label htmlFor="new-notes">Notes</label>
        <input
          id="new-notes"
          aria-label="Notes"
          value={newNotes}
          onChange={e => setNewNotes(e.target.value)}
        />
        <button onClick={handleAdd}>Add Exam</button>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Total Exams: <span data-testid="exam-count">{examCount}</span></p>
        <p>Next Exam: <span data-testid="next-exam">{nextExamTitle}</span></p>
      </section>
    </div>
  )
}
