'use client'
import React, { useEffect, useState } from 'react'
import { Task } from '../../lib/types'
export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState('all')
  const [title, setTitle] = useState('')
  const [room, setRoom] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  function load() { fetch('/api/tasks').then(r=>r.json()).then(setTasks) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,room,dueDate,priority,status:'pending'})})
      .then(()=>{setTitle('');setRoom('');setDueDate('');load()})
  }
  function handleComplete(id: string) {
    fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load())
  }
  function handleDelete(id: string) {
    fetch('/api/tasks',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load())
  }
  const filtered = filter==='all' ? tasks : tasks.filter(t=>t.status===filter)
  return <div style={{padding:'2rem'}}><h1>Tasks</h1>
    <select data-testid="task-status-filter" value={filter} onChange={e=>setFilter(e.target.value)}>
      <option value="all">all</option><option value="pending">pending</option><option value="completed">completed</option>
    </select>
    <ul data-testid="task-list" style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
      {filtered.map(t=><li key={t.id} data-testid="task-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{t.title}</strong> — {t.room} | due: {t.dueDate} | {t.priority} | {t.status}
        {t.status==='pending'&&<button data-testid="complete-task" onClick={()=>handleComplete(t.id)} style={{marginLeft:'1rem'}}>Complete</button>}
        <button data-testid="delete-task" onClick={()=>handleDelete(t.id)} style={{marginLeft:'0.5rem'}}>Delete</button>
      </li>)}
    </ul>
    <h2>Add Task</h2>
    <form data-testid="add-task-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="task-title-input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <input data-testid="task-room-input" placeholder="Room" value={room} onChange={e=>setRoom(e.target.value)} required/>
      <input data-testid="task-due-date-input" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} required/>
      <select data-testid="task-priority-select" value={priority} onChange={e=>setPriority(e.target.value as Task['priority'])}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select>
      <button data-testid="submit-task" type="submit">Add Task</button>
    </form>
  </div>
}
