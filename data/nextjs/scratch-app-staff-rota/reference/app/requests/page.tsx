'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Request, StaffMember } from '../../lib/types'

export function RequestsPage() {
  const { triggerRefresh } = useApp()
  const [requests, setRequests] = useState<Request[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [staffId, setStaffId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  function load() {
    fetch('/api/requests').then(r => r.json()).then(setRequests)
    fetch('/api/staff').then(r => r.json()).then(setStaff)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, startDate, endDate, reason }),
    })
    setStaffId(''); setStartDate(''); setEndDate(''); setReason('')
    load(); triggerRefresh()
  }

  async function handleStatus(id: string, status: 'approved' | 'denied') {
    await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load(); triggerRefresh()
  }

  function staffName(id: string) { return staff.find(s => s.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Time-Off Requests</h1>
      <form data-testid="add-request-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-request-staff" value={staffId} onChange={e => setStaffId(e.target.value)} required>
          <option value="">Select staff</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="input-request-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <input data-testid="input-request-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <input data-testid="input-request-reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" required />
        <button data-testid="btn-submit-request" type="submit">Submit Request</button>
      </form>
      <ul data-testid="request-list" style={{ listStyle: 'none', padding: 0 }}>
        {requests.map(r => (
          <li key={r.id} data-testid="request-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <span data-testid="request-staff" style={{ fontWeight: 'bold' }}>{staffName(r.staffId)}</span>
              {' | '}
              <span data-testid="request-dates">{r.startDate} to {r.endDate}</span>
              {' | '}
              <span data-testid="request-status" style={{ color: r.status === 'pending' ? 'orange' : r.status === 'approved' ? 'green' : 'red' }}>{r.status}</span>
            </span>
            {r.status === 'pending' && (
              <span>
                <button data-testid="btn-approve" onClick={() => handleStatus(r.id, 'approved')} style={{ marginRight: '0.5rem' }}>Approve</button>
                <button data-testid="btn-deny" onClick={() => handleStatus(r.id, 'denied')}>Deny</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
