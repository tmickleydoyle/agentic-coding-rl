'use client'
import React, { useEffect, useState } from 'react'
import { Task } from '../../lib/types'
export function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(()=>{ fetch('/api/tasks').then(r=>r.json()).then(setTasks) },[])
  const total = tasks.length
  const completed = tasks.filter(t=>t.status==='completed').length
  const today = '2024-06-10'
  const overdue = tasks.filter(t=>t.status==='pending'&&t.dueDate<today).length
  return <div style={{padding:'2rem'}}><h1>Home Maintenance</h1>
    <p>Total Tasks: <span data-testid="dashboard-task-count">{total}</span></p>
    <p>Overdue: <span data-testid="dashboard-overdue-count">{overdue}</span></p>
    <p>Completed: <span data-testid="dashboard-completed-count">{completed}</span></p>
  </div>
}
