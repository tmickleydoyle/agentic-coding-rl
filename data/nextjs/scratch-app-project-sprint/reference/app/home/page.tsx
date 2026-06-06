'use client'
import React, { useEffect, useState } from 'react'
import { Sprint, Ticket } from '../../lib/types'
export function HomePage() {
  const [sprints,setSprints]=useState<Sprint[]>([])
  const [tickets,setTickets]=useState<Ticket[]>([])
  const [tc,setTc]=useState(0)
  useEffect(()=>{
    fetch('/api/sprints').then(r=>r.json()).then(setSprints)
    fetch('/api/tickets').then(r=>r.json()).then(setTickets)
    fetch('/api/team').then(r=>r.json()).then((d:unknown[])=>setTc(d.length))
  },[])
  return <div style={{padding:'2rem'}}><h1>Project Sprint</h1>
    <p>Active Sprints: <span data-testid="dashboard-active-sprints">{sprints.filter(s=>s.status==='active').length}</span></p>
    <p>Open Tickets: <span data-testid="dashboard-open-tickets">{tickets.filter(t=>t.status==='open').length}</span></p>
    <p>Team Members: <span data-testid="dashboard-team-count">{tc}</span></p>
  </div>
}
