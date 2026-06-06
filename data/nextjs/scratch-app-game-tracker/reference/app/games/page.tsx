'use client'
import React, { useEffect, useState } from 'react'
import { Game } from '../../lib/types'
export function GamesPage() {
  const [games,setGames]=useState<Game[]>([])
  const [filter,setFilter]=useState('all')
  const [title,setTitle]=useState(''), [platform,setPlatform]=useState(''), [genre,setGenre]=useState(''), [status,setStatus]=useState<Game['status']>('not started')
  function load() { fetch('/api/games').then(r=>r.json()).then(setGames) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/games',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,platform,genre,status})})
      .then(()=>{setTitle('');setPlatform('');setGenre('');load()})
  }
  function handleDelete(id: string) { fetch('/api/games',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load()) }
  const filtered = filter==='all' ? games : games.filter(g=>g.status===filter)
  return <div style={{padding:'2rem'}}><h1>Games</h1>
    <select data-testid="game-status-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">all</option><option value="not started">not started</option><option value="playing">playing</option><option value="completed">completed</option><option value="dropped">dropped</option></select>
    <ul data-testid="game-list" style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
      {filtered.map(g=><li key={g.id} data-testid="game-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{g.title}</strong> — {g.platform} | {g.genre} | {g.status}
        <button data-testid="delete-game" onClick={()=>handleDelete(g.id)} style={{marginLeft:'1rem'}}>Delete</button>
      </li>)}
    </ul>
    <h2>Add Game</h2>
    <form data-testid="add-game-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="game-title-input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <input data-testid="game-platform-input" placeholder="Platform" value={platform} onChange={e=>setPlatform(e.target.value)} required/>
      <input data-testid="game-genre-input" placeholder="Genre" value={genre} onChange={e=>setGenre(e.target.value)} required/>
      <select data-testid="game-status-select" value={status} onChange={e=>setStatus(e.target.value as Game['status'])}><option value="not started">not started</option><option value="playing">playing</option><option value="completed">completed</option><option value="dropped">dropped</option></select>
      <button data-testid="submit-game" type="submit">Add</button>
    </form>
  </div>
}
