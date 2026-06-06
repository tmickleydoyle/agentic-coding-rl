'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { totalEvents: number; totalAttendees: number; upcomingEvents: number; totalSessions: number }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalEvents: 0, totalAttendees: 0, upcomingEvents: 0, totalSessions: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/events').then(r => r.json()),
      fetch('/api/attendees').then(r => r.json()),
      fetch('/api/sessions').then(r => r.json()),
    ]).then(([events, attendees, sessions]) => {
      setStats({
        totalEvents: events.length,
        totalAttendees: attendees.length,
        upcomingEvents: events.filter((e: { status: string }) => e.status === 'upcoming').length,
        totalSessions: sessions.length,
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Event Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-events">{stats.totalEvents}</div>
          <div>Total Events</div>
        </div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-attendees">{stats.totalAttendees}</div>
          <div>Attendees</div>
        </div>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-upcoming-events">{stats.upcomingEvents}</div>
          <div>Upcoming</div>
        </div>
        <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-sessions">{stats.totalSessions}</div>
          <div>Sessions</div>
        </div>
      </div>
    </div>
  )
}
