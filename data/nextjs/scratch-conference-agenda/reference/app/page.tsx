'use client'
import { useState } from 'react'

type SessionType = 'keynote' | 'talk' | 'workshop'

interface Day {
  id: number
  label: string
}

interface Session {
  id: number
  dayId: number
  title: string
  speaker: string
  room: string
  startTime: string
  durationMin: number
  type: SessionType
}

const DAYS: Day[] = [
  { id: 1, label: 'Day 1 - Sept 15' },
  { id: 2, label: 'Day 2 - Sept 16' },
]

const ROOMS = ['Main Stage', 'Room A', 'Room B']

const SEED_SESSIONS: Session[] = [
  { id: 1, dayId: 1, title: 'Opening Keynote', speaker: 'Dr. Smith', room: 'Main Stage', startTime: '09:00', durationMin: 60, type: 'keynote' },
  { id: 2, dayId: 1, title: 'React Deep Dive', speaker: 'Alice Lee', room: 'Room A', startTime: '10:15', durationMin: 45, type: 'talk' },
  { id: 3, dayId: 1, title: 'Design Systems', speaker: 'Bob Ray', room: 'Room B', startTime: '10:15', durationMin: 45, type: 'talk' },
  { id: 4, dayId: 2, title: 'AI in Production', speaker: 'Carol Fox', room: 'Main Stage', startTime: '09:00', durationMin: 90, type: 'keynote' },
  { id: 5, dayId: 2, title: 'Testing Workshop', speaker: 'Dave Lin', room: 'Room A', startTime: '11:00', durationMin: 120, type: 'workshop' },
]

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS.map(s => ({ ...s })))
  const [selectedDayId, setSelectedDayId] = useState<number>(1)
  const [roomFilter, setRoomFilter] = useState<string>('all')

  const [newTitle, setNewTitle] = useState('')
  const [newSpeaker, setNewSpeaker] = useState('')
  const [newRoom, setNewRoom] = useState('Main Stage')
  const [newStartTime, setNewStartTime] = useState('')
  const [newDuration, setNewDuration] = useState<string>('')
  const [newType, setNewType] = useState<SessionType>('talk')
  const [newDayId, setNewDayId] = useState<number>(1)

  function addSession() {
    const title = newTitle.trim()
    const speaker = newSpeaker.trim()
    const startTime = newStartTime.trim()
    const duration = Number(newDuration)
    if (!title || !speaker || !startTime || duration <= 0) return
    const maxId = sessions.reduce((m, s) => Math.max(m, s.id), 0)
    setSessions(prev => [...prev, {
      id: maxId + 1,
      dayId: newDayId,
      title,
      speaker,
      room: newRoom,
      startTime,
      durationMin: duration,
      type: newType,
    }])
    setNewTitle('')
    setNewSpeaker('')
    setNewStartTime('')
    setNewDuration('')
  }

  function removeSession(id: number) {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const daySessions = sessions
    .filter(s => s.dayId === selectedDayId)
    .filter(s => roomFilter === 'all' || s.room === roomFilter)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const keynoteCount = sessions.filter(s => s.type === 'keynote').length
  const workshopCount = sessions.filter(s => s.type === 'workshop').length

  return (
    <div>
      <h1>Conference Agenda</h1>

      <div>
        <p data-testid="total-sessions">Total Sessions: {sessions.length}</p>
        <p data-testid="keynote-count">Keynotes: {keynoteCount}</p>
        <p data-testid="workshop-count">Workshops: {workshopCount}</p>
      </div>

      <div>
        {DAYS.map(d => (
          <button
            key={d.id}
            data-testid={`day-tab-${d.id}`}
            onClick={() => setSelectedDayId(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div>
        <select aria-label="Filter by room" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
          <option value="all">all</option>
          {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <p data-testid="day-session-count">{daySessions.length} sessions</p>

      <ul>
        {daySessions.map(s => (
          <li key={s.id} data-testid={`session-${s.id}`}>
            <span>{s.title}</span>
            <span>{s.speaker}</span>
            <span data-testid={`room-${s.id}`}>{s.room}</span>
            <span data-testid={`time-${s.id}`}>{s.startTime}</span>
            <span data-testid={`duration-${s.id}`}>{s.durationMin}m</span>
            <span data-testid={`type-${s.id}`}>{s.type}</span>
            <button onClick={() => removeSession(s.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div>
        <h2>Add Session</h2>
        <input aria-label="Session title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
        <input aria-label="Speaker" value={newSpeaker} onChange={e => setNewSpeaker(e.target.value)} />
        <select aria-label="Room" value={newRoom} onChange={e => setNewRoom(e.target.value)}>
          {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input aria-label="Start time" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} />
        <input aria-label="Duration (minutes)" type="number" value={newDuration} onChange={e => setNewDuration(e.target.value)} />
        <select aria-label="Session type" value={newType} onChange={e => setNewType(e.target.value as SessionType)}>
          <option value="keynote">keynote</option>
          <option value="talk">talk</option>
          <option value="workshop">workshop</option>
        </select>
        <select aria-label="Day" value={newDayId} onChange={e => setNewDayId(Number(e.target.value))}>
          {DAYS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <button onClick={addSession}>Add Session</button>
      </div>
    </div>
  )
}
