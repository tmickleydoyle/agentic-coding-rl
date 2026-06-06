'use client'
import React, { useEffect, useState } from 'react'
import { Achievement, Game } from '../../lib/types'
export function AchievementsPage() {
  const [achievements,setAchievements]=useState<Achievement[]>([])
  const [games,setGames]=useState<Game[]>([])
  const [gameId,setGameId]=useState(''), [name,setName]=useState(''), [description,setDescription]=useState(''), [unlockedDate,setUnlockedDate]=useState('')
  function load() {
    fetch('/api/achievements').then(r=>r.json()).then(setAchievements)
    fetch('/api/games').then(r=>r.json()).then((gs:Game[])=>{ setGames(gs); if(gs.length>0&&!gameId) setGameId(gs[0].id) })
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/achievements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({gameId,name,description,unlockedDate})})
      .then(()=>{setName('');setDescription('');setUnlockedDate('');load()})
  }
  return <div style={{padding:'2rem'}}><h1>Achievements</h1>
    <ul data-testid="achievement-list" style={{listStyle:'none',padding:0}}>
      {achievements.map(a=><li key={a.id} data-testid="achievement-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{a.name}</strong> ({a.gameTitle}) — {a.description} | {a.unlockedDate}
      </li>)}
    </ul>
    <h2>Add Achievement</h2>
    <form data-testid="add-achievement-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <select data-testid="achievement-game-select" value={gameId} onChange={e=>setGameId(e.target.value)}>{games.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</select>
      <input data-testid="achievement-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="achievement-description-input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required/>
      <input data-testid="achievement-date-input" type="date" value={unlockedDate} onChange={e=>setUnlockedDate(e.target.value)} required/>
      <button data-testid="submit-achievement" type="submit">Add</button>
    </form>
  </div>
}
