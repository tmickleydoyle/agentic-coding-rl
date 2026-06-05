'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Interviews() {
  const { interviews, addInterview, deleteInterview } = useApp()
  const [participant, setParticipant] = useState('')
  const [segment, setSegment] = useState('')
  const [takeaway, setTakeaway] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = interviews.filter((i) =>
    filter.trim() === '' ? true : i.segment.toLowerCase().includes(filter.trim().toLowerCase()),
  )

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
          placeholder="Participant"
        />
        <input
          aria-label="Segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          placeholder="Segment"
        />
        <input
          aria-label="Key Takeaway"
          value={takeaway}
          onChange={(e) => setTakeaway(e.target.value)}
          placeholder="Key Takeaway"
        />
        <button onClick={handleAdd}>Add Interview</button>
      </div>
      <div>
        <input
          aria-label="Filter by segment"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by segment"
        />
      </div>
      <p>{`Showing: ${filtered.length} interview(s)`}</p>
      <ul>
        {filtered.map((i) => (
          <li key={i.id}>
            <span>{i.participant}</span>
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
