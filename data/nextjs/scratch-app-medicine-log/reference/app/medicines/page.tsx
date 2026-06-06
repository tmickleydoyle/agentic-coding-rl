'use client'
import React, { useEffect, useState } from 'react'
import { Medicine } from '../../lib/types'

export function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState<Medicine['frequency']>('daily')
  const [notes, setNotes] = useState('')

  function load() {
    fetch('/api/medicines').then(r => r.json()).then(setMedicines)
  }
  useEffect(() => { load() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dosage, frequency, notes }),
    }).then(() => { setName(''); setDosage(''); setNotes(''); load() })
  }

  function handleDelete(id: string) {
    fetch('/api/medicines', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then(() => load())
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Medicines</h1>
      <ul data-testid="medicine-list" style={{ listStyle: 'none', padding: 0 }}>
        {medicines.map(m => (
          <li key={m.id} data-testid="medicine-item" style={{ marginBottom: '0.5rem', padding: '0.5rem', border: '1px solid #ccc' }}>
            <strong>{m.name}</strong> {m.dosage} — {m.frequency}
            {m.notes && <span> | {m.notes}</span>}
            <button data-testid="delete-medicine" onClick={() => handleDelete(m.id)} style={{ marginLeft: '1rem' }}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Add Medicine</h2>
      <form data-testid="add-medicine-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <input data-testid="medicine-name-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input data-testid="medicine-dosage-input" placeholder="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} required />
        <select data-testid="medicine-frequency-select" value={frequency} onChange={e => setFrequency(e.target.value as Medicine['frequency'])}>
          <option value="daily">daily</option>
          <option value="twice daily">twice daily</option>
          <option value="weekly">weekly</option>
        </select>
        <input data-testid="medicine-notes-input" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        <button data-testid="submit-medicine" type="submit">Add Medicine</button>
      </form>
    </div>
  )
}
