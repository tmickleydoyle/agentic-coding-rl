'use client'
import React, { useEffect, useState } from 'react'
import { Medicine } from '../../lib/types'

export function SchedulePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])

  useEffect(() => {
    fetch('/api/medicines').then(r => r.json()).then(setMedicines)
  }, [])

  const groups: Record<string, Medicine[]> = {}
  medicines.forEach(m => {
    if (!groups[m.frequency]) groups[m.frequency] = []
    groups[m.frequency].push(m)
  })

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Schedule</h1>
      <ul data-testid="schedule-list" style={{ listStyle: 'none', padding: 0 }}>
        {Object.keys(groups).map(freq => (
          <li key={freq}>
            <h3>{freq}</h3>
            <ul>
              {groups[freq].map(m => (
                <li key={m.id} data-testid="schedule-item" style={{ marginBottom: '0.5rem', padding: '0.5rem', border: '1px solid #ccc' }}>
                  <strong>{m.name}</strong> — {m.dosage}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
