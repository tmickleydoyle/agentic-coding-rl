'use client'
import React, { useEffect, useState } from 'react'
import { Ticket, Sprint, TeamMember } from '../../lib/types'
export function TicketsPage() {
  const [tickets,setTickets]=useState<Ticket[]>([])
  const [sprints,setSprints]=useState<Sprint[]>([])
  const [team,setTeam]=useState<TeamMember[]>([])
  const [filter,setFilter]=useState('all')
  const [title,setTitle]=useState(''), [sprintId,setSprintId]=useState(''), [assigneeId,setAssigneeId]=useState(''), [priority,setPriority]=useState<Ticket['priority']>('medium')
  function load() {
    fetch('/api/tickets').then(r=>r.json()).then(setTickets)
    fetch('/api/sprints').then(r=>r.json()).then((ss:Sprint[])=>{ setSprints(ss); if(ss.length>0&&!sprintId) setSprintId(ss[0].id) })
    fetch('/api/team').then(r=>r.json()).then((ms:TeamMember[])=>{ setTeam(ms); if(ms.length>0&&!assigneeId) setAssigneeId(ms[0].id) })
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,sprintId,assigneeId,priority,status:'open'})})
      .then(()=>{setTitle('');load()})
  }
  function updateStatus(id: string, status: Ticket['status']) {
    fetch('/api/tickets',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})}).then(()=>load())
  }
  const filtered = filter==='all' ? tickets : tickets.filter(t=>t.status===filter)
  return <div style={{padding:'2rem'}}><h1>Tickets</h1>
    <select data-testid="ticket-status-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">all</option><option value="open">open</option><option value="in-progress">in-progress</option><option value="done">done</option></select>
    <ul data-testid="ticket-list" style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
      {filtered.map(t=><li key={t.id} data-testid="ticket-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{t.title}</strong> — {t.sprintName} | {t.assigneeName} | {t.priority}
        <select data-testid="ticket-status-select" value={t.status} onChange={e=>updateStatus(t.id,e.target.value as Ticket['status'])} style={{marginLeft:'0.5rem'}}><option value="open">open</option><option value="in-progress">in-progress</option><option value="done">done</option></select>
      </li>)}
    </ul>
    <h2>Add Ticket</h2>
    <form data-testid="add-ticket-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="ticket-title-input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <select data-testid="ticket-sprint-select" value={sprintId} onChange={e=>setSprintId(e.target.value)}>{sprints.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
      <select data-testid="ticket-assignee-select" value={assigneeId} onChange={e=>setAssigneeId(e.target.value)}>{team.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
      <select data-testid="ticket-priority-select" value={priority} onChange={e=>setPriority(e.target.value as Ticket['priority'])}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select>
      <button data-testid="submit-ticket" type="submit">Add Ticket</button>
    </form>
  </div>
}
