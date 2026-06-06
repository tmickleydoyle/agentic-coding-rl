'use client'
import React, { useEffect, useState } from 'react'
export function HomePage() {
  const [bc,setBc] = useState(0), [mc,setMc] = useState(0), [rc,setRc] = useState(0)
  useEffect(()=>{
    fetch('/api/books').then(r=>r.json()).then((d:unknown[])=>setBc(d.length))
    fetch('/api/members').then(r=>r.json()).then((d:unknown[])=>setMc(d.length))
    fetch('/api/reviews').then(r=>r.json()).then((d:unknown[])=>setRc(d.length))
  },[])
  return <div style={{padding:'2rem'}}><h1>Book Club</h1>
    <p>Books: <span data-testid="dashboard-book-count">{bc}</span></p>
    <p>Members: <span data-testid="dashboard-member-count">{mc}</span></p>
    <p>Reviews: <span data-testid="dashboard-review-count">{rc}</span></p>
  </div>
}
