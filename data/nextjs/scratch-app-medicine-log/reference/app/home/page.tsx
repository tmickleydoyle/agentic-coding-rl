'use client'
import React, { useEffect, useState } from 'react'

export function HomePage() {
  const [medicineCount, setMedicineCount] = useState(0)
  const [logCount, setLogCount] = useState(0)

  useEffect(() => {
    fetch('/api/medicines').then(r => r.json()).then((d: unknown[]) => setMedicineCount(d.length))
    fetch('/api/log').then(r => r.json()).then((d: unknown[]) => setLogCount(d.length))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Medicine Log Dashboard</h1>
      <p>Total Medicines: <span data-testid="dashboard-medicine-count">{medicineCount}</span></p>
      <p>Log Entries Today: <span data-testid="dashboard-log-count">{logCount}</span></p>
    </div>
  )
}
