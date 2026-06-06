'use client'
import React, { useEffect, useState } from 'react'
import { Session, Game } from '../../lib/types'
export function SessionsPage() {
  const [sessions,setSessions]=useState<Session[]>([])
  const [games,setGames]=useState<Game[]>([])
  const [gameId,setGameId]=useState(''), [date,setDate]=useState(''), [duration,setDuration]=useState(''), [notes,setNotes]=useState('')
  function load() {
    fetch('/api/sessions').then(r=>r.json()).then(setSessions)
    fetch('/api/games').then(r=>r.json()).then((gs:Game[])=>{ setGames(gs); if(gs.length>0&&!gameId) setGameId(gs[0].id) })
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({gameId,date,duration:Number(duration),notes})})
      .then(()=>{setDate('');setDuration('');setNotes('');load()})
  }
  return <div style={{padding:'2rem'}}><h1>Sessions</h1>
    <ul data-testid="session-list" style={{listStyle:'none',padding:0}}>
      {sessions.map(s=><li key={s.id} data-testid="session-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{s.gameTitle}</strong> — {s.date} | {s.duration}h{s.notes&&` | ${s.notes}`}
      </li>)}
    </ul>
    <h2>Add Session</h2>
    <form data-testid="add-session-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <select data-testid="session-game-select" value={gameId} onChange={e=>setGameId(e.target.value)}>{games.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</select>
      <input data-testid="session-date-input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
      <input data-testid="session-duration-input" type="number" step="0.5" placeholder="Duration (hours)" value={duration} onChange={e=>setDuration(e.target.value)} required/>
      <input data-testid="session-notes-input" placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)}/>
      <button data-testid="submit-session" type="submit">Add</button>
    </form>
  </div>
}
