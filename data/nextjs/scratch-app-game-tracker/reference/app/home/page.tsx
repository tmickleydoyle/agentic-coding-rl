'use client'
import React, { useEffect, useState } from 'react'
import { Session } from '../../lib/types'
export function HomePage() {
  const [gc,setGc]=useState(0), [hours,setHours]=useState(0), [ac,setAc]=useState(0)
  useEffect(()=>{
    fetch('/api/games').then(r=>r.json()).then((d:unknown[])=>setGc(d.length))
    fetch('/api/sessions').then(r=>r.json()).then((d:Session[])=>setHours(d.reduce((s,x)=>s+x.duration,0)))
    fetch('/api/achievements').then(r=>r.json()).then((d:unknown[])=>setAc(d.length))
  },[])
  return <div style={{padding:'2rem'}}><h1>Game Tracker</h1>
    <p>Games: <span data-testid="dashboard-game-count">{gc}</span></p>
    <p>Total Hours: <span data-testid="dashboard-total-hours">{hours}</span></p>
    <p>Achievements: <span data-testid="dashboard-achievement-count">{ac}</span></p>
  </div>
}
