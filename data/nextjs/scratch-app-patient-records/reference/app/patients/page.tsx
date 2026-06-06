'use client'
import React, { useEffect, useState } from 'react'
import { Patient } from '../../lib/types'

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('Male')
  const [phone, setPhone] = useState('')

  function load() {
    fetch('/api/patients').then(r => r.json()).then(setPatients)
  }

  useEffect(() => { load() }, [])

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dob, gender, phone }),
    }).then(r => r.json()).then(() => {
      setName(''); setDob(''); setGender('Male'); setPhone('')
      load()
    })
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Patients</h1>
      <input
        data-testid="patient-search"
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />
      <ul data-testid="patient-list" style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(p => (
          <li key={p.id} data-testid="patient-item" style={{ padding: '0.5rem', border: '1px solid #ccc', marginBottom: '0.5rem', borderRadius: '4px' }}>
            <strong>{p.name}</strong> — DOB: {p.dob} | {p.gender} | {p.phone}
          </li>
        ))}
      </ul>
      <h2>Add Patient</h2>
      <form data-testid="add-patient-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <input data-testid="patient-name-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input data-testid="patient-dob-input" type="date" value={dob} onChange={e => setDob(e.target.value)} required />
        <select data-testid="patient-gender-select" value={gender} onChange={e => setGender(e.target.value)}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input data-testid="patient-phone-input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <button data-testid="submit-patient" type="submit">Add Patient</button>
      </form>
    </div>
  )
}
