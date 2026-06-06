'use client'
import React from 'react'
export function HomePage() {
  return <div><h1>Medicine Log Dashboard</h1>
    <p>Total Medicines: <span data-testid="dashboard-medicine-count">0</span></p>
    <p>Log Entries: <span data-testid="dashboard-log-count">0</span></p>
  </div>
}
