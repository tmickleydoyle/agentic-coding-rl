'use client'
import React, { useEffect, useState } from 'react'
import { TeamMember } from '../../lib/types'
export function TeamPage() {
  const [team,setTeam]=useState<TeamMember[]>([])
  const [name,setName]=useState(''), [role,setRole]=useState(''), [email,setEmail]=useState('')
  function load() { fetch('/api/team').then(r=>r.json()).then(setTeam) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/team',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,role,email})})
      .then(()=>{setName('');setRole('');setEmail('');load()})
  }
  return <div style={{padding:'2rem'}}><h1>Team</h1>
    <ul data-testid="team-list" style={{listStyle:'none',padding:0}}>
      {team.map(m=><li key={m.id} data-testid="team-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{m.name}</strong> — {m.role} | {m.email}
      </li>)}
    </ul>
    <h2>Add Team Member</h2>
    <form data-testid="add-team-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="team-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="team-role-input" placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} required/>
      <input data-testid="team-email-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <button data-testid="submit-team" type="submit">Add</button>
    </form>
  </div>
}
