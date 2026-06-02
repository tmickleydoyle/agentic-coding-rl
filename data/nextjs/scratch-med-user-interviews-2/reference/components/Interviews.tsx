'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Interviews() {
  const { interviews, addInterview, deleteInterview } = useApp()
  const [participant, setParticipant] = useState('')
  const [segment, setSegment] = useState('')
  const [takeaway, setTakeaway] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = interviews.filter(
    (iv) => filter.trim() === '' || iv.segment.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <section aria-label="Interviews view">
      <h1>{`Interviews (${filtered.length})`}</h1>
      <div>
        <input
          aria-label="Participant"
          value={participant}
          onChange={(e) => setParticipant(e.target.value)}
        />
        <input
          aria-label="Segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
        />
        <input
          aria-label="Key Takeaway"
          value={takeaway}
          onChange={(e) => setTakeaway(e.target.value)}
        />
        <button
          onClick={() => {
            addInterview(participant, segment, takeaway)
            setParticipant('')
            setSegment('')
            setTakeaway('')
          }}
        >
          Add Interview
        </button>
      </div>
      <input
        aria-label="Filter by segment"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filtered.map((iv) => (
          <li key={iv.id}>
            <span>{iv.participant}</span>
            <span>{iv.segment}</span>
            <span>{iv.takeaway}</span>
            <button aria-label={`Delete ${iv.participant}`} onClick={() => deleteInterview(iv.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
