'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import SessionCard from '../../components/SessionCard'

export default function SchedulePage() {
  const { sessions, selectSession } = useApp()
  const [track, setTrack] = useState('All')

  const tracks: string[] = []
  sessions.forEach((s) => {
    if (tracks.indexOf(s.track) === -1) tracks.push(s.track)
  })

  const visible = track === 'All' ? sessions : sessions.filter((s) => s.track === track)

  return (
    <section data-testid="page-schedule">
      <h1>Schedule</h1>
      <label htmlFor="track">Track</label>
      <select
        id="track"
        data-testid="track-filter"
        value={track}
        onChange={(e) => setTrack(e.target.value)}
      >
        <option value="All">All</option>
        {tracks.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {visible.length === 0 ? (
        <p data-testid="no-sessions">No sessions.</p>
      ) : (
        <ul data-testid="sessions-list">
          {visible.map((s) => (
            <SessionCard key={s.id} session={s} onView={selectSession} />
          ))}
        </ul>
      )}
    </section>
  )
}
