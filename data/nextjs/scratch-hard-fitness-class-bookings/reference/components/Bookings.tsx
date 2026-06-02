'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Bookings() {
  const { classes, bookings, book, cancel } = useStudio()
  const [classId, setClassId] = useState('')
  const [member, setMember] = useState('')

  const nameOf = (id: number) => classes.find((c) => c.id === id)?.name ?? ''

  return (
    <section aria-label="Bookings view">
      <h1>Bookings</h1>
      <select aria-label="Class" value={classId} onChange={(e) => setClassId(e.target.value)}>
        <option value="">Select a class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input aria-label="Member name" value={member} onChange={(e) => setMember(e.target.value)} />
      <button
        onClick={() => {
          book(classId, member)
          setMember('')
        }}
      >
        Book spot
      </button>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            <span>
              {`${b.member} - ${nameOf(b.classId)}${b.waitlisted ? ' (waitlisted)' : ''}`}
            </span>
            <button onClick={() => cancel(b.id)} aria-label={`Cancel ${b.member}`}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
