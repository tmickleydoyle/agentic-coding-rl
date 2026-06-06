'use client'
import React, { useEffect, useState } from 'react'
import { Task } from '../../lib/types'
export function HistoryPage() {
  const [history, setHistory] = useState<Task[]>([])
  useEffect(()=>{ fetch('/api/history').then(r=>r.json()).then(setHistory) },[])
  return <div style={{padding:'2rem'}}><h1>Maintenance History</h1>
    <ul data-testid="history-list" style={{listStyle:'none',padding:0}}>
      {history.map(t=><li key={t.id} data-testid="history-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{t.title}</strong> — {t.room} | completed: {t.completedDate}
      </li>)}
    </ul>
  </div>
}
