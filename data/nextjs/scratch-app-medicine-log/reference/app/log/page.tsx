'use client'
import React, { useEffect, useState } from 'react'
import { LogEntry, Medicine } from '../../lib/types'

export function LogPage() {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [medicineId, setMedicineId] = useState('')
  const [datetime, setDatetime] = useState('')
  const [notes, setNotes] = useState('')

  function load() {
    fetch('/api/log').then(r => r.json()).then(setEntries)
    fetch('/api/medicines').then(r => r.json()).then((ms: Medicine[]) => {
      setMedicines(ms)
      if (ms.length > 0 && !medicineId) setMedicineId(ms[0].id)
    })
  }
  useEffect(() => { load() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicineId, datetime, notes }),
    }).then(() => { setDatetime(''); setNotes(''); load() })
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dose Log</h1>
      <ul data-testid="log-list" style={{ listStyle: 'none', padding: 0 }}>
        {entries.map(e => (
          <li key={e.id} data-testid="log-item" style={{ marginBottom: '0.5rem', padding: '0.5rem', border: '1px solid #ccc' }}>
            <strong>{e.medicineName}</strong> — {e.datetime}
            {e.notes && <span> | {e.notes}</span>}
          </li>
        ))}
      </ul>
      <h2>Log Dose</h2>
      <form data-testid="add-log-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <select data-testid="log-medicine-select" value={medicineId} onChange={e => setMedicineId(e.target.value)}>
          {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input data-testid="log-datetime-input" type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} required />
        <input data-testid="log-notes-input" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        <button data-testid="submit-log" type="submit">Log Dose</button>
      </form>
    </div>
  )
}
