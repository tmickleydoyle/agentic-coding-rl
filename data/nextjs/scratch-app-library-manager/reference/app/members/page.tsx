'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Member } from '../../lib/types'

export function MembersPage() {
  const { triggerRefresh } = useApp()
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [membershipId, setMembershipId] = useState('')

  function load() {
    fetch('/api/members').then(r => r.json()).then(setMembers)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const joinDate = new Date().toISOString().slice(0, 10)
    await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, membershipId, joinDate }),
    })
    setName(''); setEmail(''); setMembershipId('')
    load()
    triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Members</h1>
      <form data-testid="add-member-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-member-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-member-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input data-testid="input-member-id" value={membershipId} onChange={e => setMembershipId(e.target.value)} placeholder="Membership ID" required />
        <button data-testid="btn-add-member" type="submit">Add Member</button>
      </form>
      <ul data-testid="member-list" style={{ listStyle: 'none', padding: 0 }}>
        {members.map(member => (
          <li key={member.id} data-testid="member-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="member-name" style={{ fontWeight: 'bold' }}>{member.name}</span>
            {' | '}
            <span data-testid="member-email">{member.email}</span>
            {' | '}
            <span data-testid="member-membership-id">{member.membershipId}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
