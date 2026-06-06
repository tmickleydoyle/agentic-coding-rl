'use client'
import React, { useEffect, useState } from 'react'

export function HomePage() {
  const [patientCount, setPatientCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then((d: unknown[]) => setPatientCount(d.length))
    fetch('/api/appointments').then(r => r.json()).then((d: unknown[]) => setAppointmentCount(d.length))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Patient Records Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h2>Total Patients</h2>
          <p data-testid="dashboard-patient-count" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{patientCount}</p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h2>Total Appointments</h2>
          <p data-testid="dashboard-appointment-count" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{appointmentCount}</p>
        </div>
      </div>
    </div>
  )
}
