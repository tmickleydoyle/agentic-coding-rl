'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Location } from '../../lib/types'

export function LocationsPage() {
  const { triggerRefresh } = useApp()
  const [locations, setLocations] = useState<Location[]>([])
  const [code, setCode] = useState('')
  const [zone, setZone] = useState('')
  const [capacity, setCapacity] = useState('')

  function load() { fetch('/api/locations').then(r => r.json()).then(setLocations) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, zone, capacity: Number(capacity) }),
    })
    setCode(''); setZone(''); setCapacity('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Locations</h1>
      <form data-testid="add-location-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-location-code" value={code} onChange={e => setCode(e.target.value)} placeholder="Code" required />
        <input data-testid="input-location-zone" value={zone} onChange={e => setZone(e.target.value)} placeholder="Zone" required />
        <input data-testid="input-location-capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Capacity" required />
        <button data-testid="btn-add-location" type="submit">Add Location</button>
      </form>
      <ul data-testid="location-list" style={{ listStyle: 'none', padding: 0 }}>
        {locations.map(l => (
          <li key={l.id} data-testid="location-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="location-code" style={{ fontWeight: 'bold' }}>{l.code}</span>
            {' | '}
            <span data-testid="location-zone">{l.zone}</span>
            {' | Cap: '}
            <span data-testid="location-capacity">{l.capacity}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
