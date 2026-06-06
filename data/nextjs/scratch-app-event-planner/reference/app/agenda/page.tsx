'use client'
import React, { useEffect, useState } from 'react'
import { Event, Guest } from '../../lib/types'
export function AgendaPage() {
  const [events,setEvents]=useState<Event[]>([])
  const [guests,setGuests]=useState<Guest[]>([])
  useEffect(()=>{
    fetch('/api/events').then(r=>r.json()).then((es:Event[])=>setEvents([...es].sort((a,b)=>a.date.localeCompare(b.date))))
    fetch('/api/guests').then(r=>r.json()).then(setGuests)
  },[])
  return <div style={{padding:'2rem'}}><h1>Agenda</h1>
    <ul data-testid="agenda-list" style={{listStyle:'none',padding:0}}>
      {events.map(ev=>{
        const gc = guests.filter(g=>g.eventId===ev.id).length
        return <li key={ev.id} data-testid="agenda-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
          <strong>{ev.title}</strong> — {ev.date} | {ev.location} | {gc} guest(s)
        </li>
      })}
    </ul>
  </div>
}
