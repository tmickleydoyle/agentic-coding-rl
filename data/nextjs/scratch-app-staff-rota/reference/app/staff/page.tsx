'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { StaffMember } from '../../lib/types'

export function StaffPage() {
  const { triggerRefresh } = useApp()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')

  function load() { fetch('/api/staff').then(r => r.json()).then(setStaff) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, department }),
    })
    setName(''); setEmail(''); setRole(''); setDepartment('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Staff</h1>
      <form data-testid="add-staff-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-staff-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-staff-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input data-testid="input-staff-role" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" required />
        <input data-testid="input-staff-department" value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" required />
        <button data-testid="btn-add-staff" type="submit">Add Staff</button>
      </form>
      <ul data-testid="staff-list" style={{ listStyle: 'none', padding: 0 }}>
        {staff.map(s => (
          <li key={s.id} data-testid="staff-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="staff-name" style={{ fontWeight: 'bold' }}>{s.name}</span>
            {' | '}
            <span data-testid="staff-role">{s.role}</span>
            {' | '}
            <span data-testid="staff-department">{s.department}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
