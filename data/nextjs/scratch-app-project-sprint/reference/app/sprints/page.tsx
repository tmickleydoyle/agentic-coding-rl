'use client'
import React, { useEffect, useState } from 'react'
import { Sprint } from '../../lib/types'
export function SprintsPage() {
  const [sprints,setSprints]=useState<Sprint[]>([])
  const [name,setName]=useState(''), [startDate,setStartDate]=useState(''), [endDate,setEndDate]=useState('')
  function load() { fetch('/api/sprints').then(r=>r.json()).then(setSprints) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/sprints',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,startDate,endDate,status:'planning'})})
      .then(()=>{setName('');setStartDate('');setEndDate('');load()})
  }
  function updateStatus(id: string, status: Sprint['status']) {
    fetch('/api/sprints',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})}).then(()=>load())
  }
  return <div style={{padding:'2rem'}}><h1>Sprints</h1>
    <ul data-testid="sprint-list" style={{listStyle:'none',padding:0}}>
      {sprints.map(s=><li key={s.id} data-testid="sprint-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{s.name}</strong> {s.startDate}–{s.endDate} | {s.status}
        {s.status==='planning'&&<button data-testid="start-sprint" onClick={()=>updateStatus(s.id,'active')} style={{marginLeft:'0.5rem'}}>Start</button>}
        {s.status==='active'&&<button data-testid="complete-sprint" onClick={()=>updateStatus(s.id,'completed')} style={{marginLeft:'0.5rem'}}>Complete</button>}
      </li>)}
    </ul>
    <h2>Add Sprint</h2>
    <form data-testid="add-sprint-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="sprint-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="sprint-start-input" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required/>
      <input data-testid="sprint-end-input" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required/>
      <button data-testid="submit-sprint" type="submit">Add Sprint</button>
    </form>
  </div>
}
