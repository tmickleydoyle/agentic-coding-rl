'use client'
import React, { useEffect, useState } from 'react'
import { Member, Review } from '../../lib/types'
export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [name,setName] = useState(''), [joinDate,setJoinDate] = useState('')
  function load() {
    fetch('/api/members').then(r=>r.json()).then(setMembers)
    fetch('/api/reviews').then(r=>r.json()).then(setReviews)
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/members',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,joinDate})})
      .then(()=>{setName('');setJoinDate('');load()})
  }
  return <div style={{padding:'2rem'}}><h1>Members</h1>
    <ul data-testid="member-list" style={{listStyle:'none',padding:0}}>
      {members.map(m=>{
        const rc = reviews.filter(r=>r.memberId===m.id).length
        return <li key={m.id} data-testid="member-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
          <strong>{m.name}</strong> — joined {m.joinDate} | reviews: {rc}
        </li>
      })}
    </ul>
    <h2>Add Member</h2>
    <form data-testid="add-member-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="member-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="member-join-date-input" type="date" value={joinDate} onChange={e=>setJoinDate(e.target.value)} required/>
      <button data-testid="submit-member" type="submit">Add Member</button>
    </form>
  </div>
}
