'use client'
import React, { useEffect, useState } from 'react'
import { Appointment, Patient } from '../../lib/types'

const statusColors: Record<string, string> = {
  scheduled: '#1565c0',
  completed: '#2e7d32',
  cancelled: '#c62828',
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  function load() {
    fetch('/api/appointments').then(r => r.json()).then(setAppointments)
    fetch('/api/patients').then(r => r.json()).then((ps: Patient[]) => {
      setPatients(ps)
      if (ps.length > 0 && !patientId) setPatientId(ps[0].id)
    })
  }

  useEffect(() => { load() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, date, time, reason }),
    }).then(r => r.json()).then(() => {
      setDate(''); setTime(''); setReason('')
      load()
    })
  }

  function updateStatus(id: string, status: string) {
    fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).then(() => load())
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Appointments</h1>
      <ul data-testid="appointment-list" style={{ listStyle: 'none', padding: 0 }}>
        {appointments.map(a => (
          <li key={a.id} data-testid="appointment-item" style={{ padding: '0.5rem', border: '1px solid #ccc', marginBottom: '0.5rem', borderRadius: '4px' }}>
            <strong>{a.patientName}</strong> — {a.date} {a.time} | {a.reason}
            <span style={{ color: statusColors[a.status], marginLeft: '0.5rem', fontWeight: 'bold' }}>[{a.status}]</span>
            {a.status === 'scheduled' && (
              <>
                <button data-testid="complete-appointment" onClick={() => updateStatus(a.id, 'completed')} style={{ marginLeft: '1rem' }}>Complete</button>
                <button data-testid="cancel-appointment" onClick={() => updateStatus(a.id, 'cancelled')} style={{ marginLeft: '0.5rem' }}>Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2>Add Appointment</h2>
      <form data-testid="add-appointment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <select data-testid="appointment-patient-select" value={patientId} onChange={e => setPatientId(e.target.value)}>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="appointment-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input data-testid="appointment-time-input" type="time" value={time} onChange={e => setTime(e.target.value)} required />
        <input data-testid="appointment-reason-input" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} required />
        <button data-testid="submit-appointment" type="submit">Add Appointment</button>
      </form>
    </div>
  )
}
