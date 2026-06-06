'use client'
import React, { useEffect, useState } from 'react'
import { Event } from '../../lib/types'
export function EventsPage() {
  const [events,setEvents]=useState<Event[]>([])
  const [filter,setFilter]=useState('all')
  const [title,setTitle]=useState(''), [date,setDate]=useState(''), [location,setLocation]=useState(''), [category,setCategory]=useState<Event['category']>('other')
  function load() { fetch('/api/events').then(r=>r.json()).then(setEvents) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,date,location,category,status:'planned'})})
      .then(()=>{setTitle('');setDate('');setLocation('');load()})
  }
  function handleDelete(id: string) { fetch('/api/events',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load()) }
  const filtered = filter==='all' ? events : events.filter(ev=>ev.category===filter)
  return <div style={{padding:'2rem'}}><h1>Events</h1>
    <select data-testid="event-category-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">all</option><option value="meeting">meeting</option><option value="party">party</option><option value="conference">conference</option><option value="other">other</option></select>
    <ul data-testid="event-list" style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
      {filtered.map(ev=><li key={ev.id} data-testid="event-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{ev.title}</strong> — {ev.date} | {ev.location} | {ev.category}
        <button data-testid="delete-event" onClick={()=>handleDelete(ev.id)} style={{marginLeft:'1rem'}}>Delete</button>
      </li>)}
    </ul>
    <h2>Add Event</h2>
    <form data-testid="add-event-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="event-title-input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <input data-testid="event-date-input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
      <input data-testid="event-location-input" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} required/>
      <select data-testid="event-category-select" value={category} onChange={e=>setCategory(e.target.value as Event['category'])}><option value="meeting">meeting</option><option value="party">party</option><option value="conference">conference</option><option value="other">other</option></select>
      <button data-testid="submit-event" type="submit">Add Event</button>
    </form>
  </div>
}
