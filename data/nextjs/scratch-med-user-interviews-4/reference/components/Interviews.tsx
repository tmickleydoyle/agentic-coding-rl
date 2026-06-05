'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Interviews() {
  const { interviews, addInterview, deleteInterview } = useApp()
  const [participant, setParticipant] = useState('')
  const [segment, setSegment] = useState('')
  const [takeaway, setTakeaway] = useState('')
  const [filter, setFilter] = useState('')

  const visible = filter.trim()
    ? interviews.filter((i) => i.segment.toLowerCase().includes(filter.trim().toLowerCase()))
    : interviews

  return (
    <section aria-label="Interviews view">
      <h1>Interviews</h1>
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
        <textarea
          aria-label="Key takeaway"
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
          Add interview
        </button>
      </div>
      <input
        aria-label="Filter by segment"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p>{`Showing: ${visible.length} interview(s)`}</p>
      <ul>
        {visible.map((i) => (
          <li key={i.id}>
            <strong>{i.participant}</strong>
            <span>{i.segment}</span>
            <span>{i.takeaway}</span>
            <button aria-label={`Delete ${i.participant}`} onClick={() => deleteInterview(i.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
