'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Shift, StaffMember } from '../../lib/types'

export function ShiftsPage() {
  const { triggerRefresh } = useApp()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [staffId, setStaffId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [role, setRole] = useState('')

  function load() {
    fetch('/api/shifts').then(r => r.json()).then(setShifts)
    fetch('/api/staff').then(r => r.json()).then(setStaff)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, date, startTime, endTime, role }),
    })
    setStaffId(''); setDate(''); setStartTime(''); setEndTime(''); setRole('')
    load(); triggerRefresh()
  }

  function staffName(id: string) { return staff.find(s => s.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Shifts</h1>
      <form data-testid="add-shift-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-shift-staff" value={staffId} onChange={e => setStaffId(e.target.value)} required>
          <option value="">Select staff</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="input-shift-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input data-testid="input-shift-start" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        <input data-testid="input-shift-end" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        <input data-testid="input-shift-role" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" required />
        <button data-testid="btn-add-shift" type="submit">Add Shift</button>
      </form>
      <ul data-testid="shift-list" style={{ listStyle: 'none', padding: 0 }}>
        {shifts.map(sh => (
          <li key={sh.id} data-testid="shift-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="shift-staff" style={{ fontWeight: 'bold' }}>{staffName(sh.staffId)}</span>
            {' | '}
            <span data-testid="shift-date">{sh.date}</span>
            {' | '}
            <span data-testid="shift-time">{sh.startTime} - {sh.endTime}</span>
            {' | '}
            <span data-testid="shift-role">{sh.role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
