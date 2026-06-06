'use client'
import React, { useEffect, useState } from 'react'
import { Task } from '../../lib/types'
export function RoomsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(()=>{ fetch('/api/tasks').then(r=>r.json()).then(setTasks) },[])
  const roomMap: Record<string,number> = {}
  tasks.forEach(t=>{ roomMap[t.room]=(roomMap[t.room]||0)+1 })
  const rooms = Object.keys(roomMap)
  return <div style={{padding:'2rem'}}><h1>Rooms</h1>
    <ul data-testid="room-list" style={{listStyle:'none',padding:0}}>
      {rooms.map(r=><li key={r} data-testid="room-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{r}</strong>: {roomMap[r]} task(s)
      </li>)}
    </ul>
  </div>
}
