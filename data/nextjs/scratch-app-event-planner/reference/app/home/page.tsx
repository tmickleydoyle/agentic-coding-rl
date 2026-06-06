'use client'
import React, { useEffect, useState } from 'react'
import { Event } from '../../lib/types'
export function HomePage() {
  const [events,setEvents]=useState<Event[]>([])
  const [gc,setGc]=useState(0)
  const today = '2024-06-10'
  useEffect(()=>{
    fetch('/api/events').then(r=>r.json()).then(setEvents)
    fetch('/api/guests').then(r=>r.json()).then((d:unknown[])=>setGc(d.length))
  },[])
  const upcoming = events.filter(e=>e.date>=today).length
  return <div style={{padding:'2rem'}}><h1>Event Planner</h1>
    <p>Total Events: <span data-testid="dashboard-event-count">{events.length}</span></p>
    <p>Upcoming: <span data-testid="dashboard-upcoming-count">{upcoming}</span></p>
    <p>Total Guests: <span data-testid="dashboard-guest-count">{gc}</span></p>
  </div>
}
