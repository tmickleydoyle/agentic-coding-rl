'use client'
import React, { useEffect, useState } from 'react'
import { MedicalRecord, Patient } from '../../lib/types'

export function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')

  function load() {
    fetch('/api/records').then(r => r.json()).then(setRecords)
    fetch('/api/patients').then(r => r.json()).then((ps: Patient[]) => {
      setPatients(ps)
      if (ps.length > 0 && !patientId) setPatientId(ps[0].id)
    })
  }

  useEffect(() => { load() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, date, diagnosis, notes }),
    }).then(r => r.json()).then(() => {
      setDate(''); setDiagnosis(''); setNotes('')
      load()
    })
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Medical Records</h1>
      <ul data-testid="record-list" style={{ listStyle: 'none', padding: 0 }}>
        {records.map(r => (
          <li key={r.id} data-testid="record-item" style={{ padding: '0.5rem', border: '1px solid #ccc', marginBottom: '0.5rem', borderRadius: '4px' }}>
            <strong>{r.patientName}</strong> — {r.date} | <em>{r.diagnosis}</em>
            {r.notes && <p style={{ margin: '0.25rem 0 0 0', color: '#555' }}>{r.notes}</p>}
          </li>
        ))}
      </ul>
      <h2>Add Record</h2>
      <form data-testid="add-record-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <select data-testid="record-patient-select" value={patientId} onChange={e => setPatientId(e.target.value)}>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="record-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input data-testid="record-diagnosis-input" placeholder="Diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required />
        <textarea data-testid="record-notes-input" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        <button data-testid="submit-record" type="submit">Add Record</button>
      </form>
    </div>
  )
}
