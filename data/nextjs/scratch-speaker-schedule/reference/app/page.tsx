'use client'
import { useState } from 'react'

interface Speaker {
  id: number
  name: string
  topic: string
  duration: number
  track: string
}

const SPEAKERS: Speaker[] = [
  { id: 1, name: 'Dr. Alice Chen', topic: 'Machine Learning Trends', duration: 45, track: 'AI' },
  { id: 2, name: 'Bob Martinez', topic: 'Scaling Microservices', duration: 30, track: 'Engineering' },
  { id: 3, name: 'Carol White', topic: 'UX Research Methods', duration: 60, track: 'Design' },
  { id: 4, name: 'Dave Kim', topic: 'Cloud Security', duration: 45, track: 'Security' },
  { id: 5, name: 'Eve Johnson', topic: 'React Performance', duration: 30, track: 'Engineering' },
]

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:15', '14:00', '14:45', '15:00', '15:30']

const INITIAL_ASSIGNMENTS: Record<number, string> = { 1: '09:00', 3: '14:00' }

export default function App() {
  const [assignments, setAssignments] = useState<Record<number, string>>({ ...INITIAL_ASSIGNMENTS })
  const [trackFilter, setTrackFilter] = useState('all')
  const [pendingSlots, setPendingSlots] = useState<Record<number, string>>({})

  function assignSlot(speakerId: number) {
    const slot = pendingSlots[speakerId] || ''
    if (!slot) return
    const takenBy = Object.entries(assignments).find(([, s]) => s === slot)
    if (takenBy) return
    setAssignments(prev => ({ ...prev, [speakerId]: slot }))
    setPendingSlots(prev => { const next = { ...prev }; delete next[speakerId]; return next })
  }

  function reassignSlot(speakerId: number, slot: string) {
    setAssignments(prev => ({ ...prev, [speakerId]: slot }))
  }

  function unassign(speakerId: number) {
    setAssignments(prev => { const next = { ...prev }; delete next[speakerId]; return next })
  }

  const filteredSpeakers = trackFilter === 'all' ? SPEAKERS : SPEAKERS.filter(s => s.track === trackFilter)
  const assignedSpeakers = filteredSpeakers.filter(s => assignments[s.id] !== undefined)
  const unassignedSpeakers = filteredSpeakers.filter(s => assignments[s.id] === undefined)

  const totalAssigned = Object.keys(assignments).length
  const totalUnassigned = SPEAKERS.length - totalAssigned

  return (
    <div>
      <h1>Speaker Schedule</h1>

      <div>
        <p data-testid="total-speakers">Total Speakers: {SPEAKERS.length}</p>
        <p data-testid="assigned-count">Assigned: {totalAssigned}</p>
        <p data-testid="unassigned-count">Unassigned: {totalUnassigned}</p>
      </div>

      <div>
        <select aria-label="Filter by track" value={trackFilter} onChange={e => setTrackFilter(e.target.value)}>
          <option value="all">all</option>
          <option value="AI">AI</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Security">Security</option>
        </select>
      </div>

      <p data-testid="showing-count">Showing {filteredSpeakers.length} speakers</p>

      <div>
        <h2>Assigned Speakers</h2>
        <ul>
          {assignedSpeakers.map(s => (
            <li key={s.id} data-testid={`speaker-${s.id}`}>
              <span>{s.name}</span>
              <span>{s.topic}</span>
              <span data-testid={`duration-${s.id}`}>{s.duration}m</span>
              <span data-testid={`track-${s.id}`}>{s.track}</span>
              <span data-testid={`slot-${s.id}`}>{assignments[s.id]}</span>
              <select
                aria-label={`Time slot for ${s.name}`}
                value={assignments[s.id]}
                onChange={e => reassignSlot(s.id, e.target.value)}
              >
                {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              <button onClick={() => unassign(s.id)}>Unassign</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Unassigned Speakers</h2>
        <ul>
          {unassignedSpeakers.map(s => (
            <li key={s.id} data-testid={`unassigned-${s.id}`}>
              <span>{s.name}</span>
              <span>{s.topic}</span>
              <span>{s.track}</span>
              <select
                aria-label={`Assign slot for ${s.name}`}
                value={pendingSlots[s.id] || ''}
                onChange={e => setPendingSlots(prev => ({ ...prev, [s.id]: e.target.value }))}
              >
                <option value="">-- select slot --</option>
                {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              <button onClick={() => assignSlot(s.id)}>Assign</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
