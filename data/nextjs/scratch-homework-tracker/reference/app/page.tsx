'use client'
import { useState } from 'react'

interface Assignment {
  id: number
  subject: string
  title: string
  dueDate: string
  completed: boolean
}

const SEED: Assignment[] = [
  { id: 1, subject: 'Math',    title: 'Algebra Problem Set',  dueDate: '2024-02-10', completed: true  },
  { id: 2, subject: 'Science', title: 'Lab Report Draft',     dueDate: '2024-02-12', completed: false },
  { id: 3, subject: 'English', title: 'Essay Outline',        dueDate: '2024-02-08', completed: true  },
  { id: 4, subject: 'History', title: 'Chapter 5 Reading',    dueDate: '2024-02-15', completed: false },
  { id: 5, subject: 'Math',    title: 'Geometry Quiz Prep',   dueDate: '2024-02-14', completed: false },
  { id: 6, subject: 'Science', title: 'Research Notes',       dueDate: '2024-02-11', completed: true  },
]

const SUBJECTS = ['Math', 'Science', 'English', 'History']

export default function App() {
  const [assignments, setAssignments] = useState<Assignment[]>(SEED.map(a => ({ ...a })))
  const [statusFilter, setStatusFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newDue, setNewDue] = useState('')

  function toggleCompleted(id: number) {
    setAssignments(prev =>
      prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    )
  }

  function handleAdd() {
    if (!newTitle.trim() || !newSubject.trim()) return
    const id = assignments.length > 0 ? Math.max(...assignments.map(a => a.id)) + 1 : 1
    setAssignments(prev => [...prev, {
      id,
      title: newTitle.trim(),
      subject: newSubject.trim(),
      dueDate: newDue,
      completed: false,
    }])
    setNewTitle('')
    setNewSubject('')
    setNewDue('')
  }

  const filtered = assignments.filter(a => {
    const statusMatch =
      statusFilter === 'All' ||
      (statusFilter === 'Completed' && a.completed) ||
      (statusFilter === 'Pending' && !a.completed)
    const subjectMatch = subjectFilter === 'All' || a.subject === subjectFilter
    return statusMatch && subjectMatch
  })

  const totalCount = assignments.length
  const pendingCount = assignments.filter(a => !a.completed).length
  const completedCount = assignments.filter(a => a.completed).length

  return (
    <div>
      <h1>Homework Tracker</h1>

      <section>
        <label htmlFor="status-filter">Filter by Status</label>
        <select
          id="status-filter"
          aria-label="Filter by Status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <label htmlFor="subject-filter">Filter by Subject</label>
        <select
          id="subject-filter"
          aria-label="Filter by Subject"
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
        >
          <option>All</option>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </section>

      <ul>
        {filtered.map(a => (
          <li key={a.id} data-testid="assignment-item">
            <input
              type="checkbox"
              aria-label={a.title}
              checked={a.completed}
              onChange={() => toggleCompleted(a.id)}
            />
            <span data-testid="assignment-title">{a.title}</span>
            <span data-testid="assignment-subject">{a.subject}</span>
            <span data-testid="assignment-due">{a.dueDate}</span>
            <span data-testid="assignment-status">{a.completed ? 'Completed' : 'Pending'}</span>
          </li>
        ))}
      </ul>

      <section>
        <h2>Add Assignment</h2>
        <label htmlFor="new-title">Title</label>
        <input
          id="new-title"
          aria-label="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <label htmlFor="new-subject">Subject</label>
        <input
          id="new-subject"
          aria-label="Subject"
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
        />
        <label htmlFor="new-due">Due Date</label>
        <input
          id="new-due"
          aria-label="Due Date"
          type="date"
          value={newDue}
          onChange={e => setNewDue(e.target.value)}
        />
        <button onClick={handleAdd}>Add Assignment</button>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Total: <span data-testid="total-count">{totalCount}</span></p>
        <p>Pending: <span data-testid="pending-count">{pendingCount}</span></p>
        <p>Completed: <span data-testid="completed-count">{completedCount}</span></p>
      </section>
    </div>
  )
}
