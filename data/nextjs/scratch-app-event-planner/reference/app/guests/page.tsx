'use client'
import React, { useEffect, useState } from 'react'
import { Guest, Event } from '../../lib/types'
export function GuestsPage() {
  const [guests,setGuests]=useState<Guest[]>([])
  const [events,setEvents]=useState<Event[]>([])
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [eventId,setEventId]=useState(''), [rsvp,setRsvp]=useState<Guest['rsvp']>('pending')
  function load() {
    fetch('/api/guests').then(r=>r.json()).then(setGuests)
    fetch('/api/events').then(r=>r.json()).then((es:Event[])=>{ setEvents(es); if(es.length>0&&!eventId) setEventId(es[0].id) })
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/guests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,eventId,rsvp})})
      .then(()=>{setName('');setEmail('');load()})
  }
  function updateRsvp(id: string, newRsvp: Guest['rsvp']) {
    fetch('/api/guests',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,rsvp:newRsvp})}).then(()=>load())
  }
  return <div style={{padding:'2rem'}}><h1>Guests</h1>
    <ul data-testid="guest-list" style={{listStyle:'none',padding:0}}>
      {guests.map(g=><li key={g.id} data-testid="guest-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{g.name}</strong> ({g.email}) — {g.eventTitle} | {g.rsvp}
        {g.rsvp!=='confirmed'&&<button data-testid="confirm-guest" onClick={()=>updateRsvp(g.id,'confirmed')} style={{marginLeft:'0.5rem'}}>Confirm</button>}
        {g.rsvp!=='declined'&&<button data-testid="decline-guest" onClick={()=>updateRsvp(g.id,'declined')} style={{marginLeft:'0.5rem'}}>Decline</button>}
      </li>)}
    </ul>
    <h2>Add Guest</h2>
    <form data-testid="add-guest-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="guest-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="guest-email-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <select data-testid="guest-event-select" value={eventId} onChange={e=>setEventId(e.target.value)}>{events.map(ev=><option key={ev.id} value={ev.id}>{ev.title}</option>)}</select>
      <select data-testid="guest-rsvp-select" value={rsvp} onChange={e=>setRsvp(e.target.value as Guest['rsvp'])}><option value="pending">pending</option><option value="confirmed">confirmed</option><option value="declined">declined</option></select>
      <button data-testid="submit-guest" type="submit">Add Guest</button>
    </form>
  </div>
}
