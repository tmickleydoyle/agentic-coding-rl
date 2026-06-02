'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Interviews() {
  const { interviews, addInterview } = useApp()
  const [participant, setParticipant] = useState('')
  const [segment, setSegment] = useState('')
  const [takeaway, setTakeaway] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = filter.trim()
    ? interviews.filter((i) => i.segment.toLowerCase() === filter.trim().toLowerCase())
    : interviews

  function handleAdd() {
    addInterview(participant, segment, takeaway)
    setParticipant('')
    setSegment('')
    setTakeaway('')
  }

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
        <input
          aria-label="Key Takeaway"
          value={takeaway}
          onChange={(e) => setTakeaway(e.target.value)}
        />
        <button onClick={handleAdd}>Add Interview</button>
      </div>
      <div>
        <input
          aria-label="Filter by segment"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul>
        {filtered.map((i) => (
          <li key={i.id}>{`${i.participant} (${i.segment}): ${i.takeaway}`}</li>
        ))}
      </ul>
      <p>{`Showing: ${filtered.length}`}</p>
    </section>
  )
}
