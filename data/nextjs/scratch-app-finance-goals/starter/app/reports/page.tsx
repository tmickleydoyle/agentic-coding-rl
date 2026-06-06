'use client'
import React from 'react'

export function ReportsPage() {
  return (
    <div data-testid="reports-page">
      <h1>Reports</h1>
      <div data-testid="report-completed">Completed: 0</div>
      <div data-testid="report-at-risk">At Risk: 0</div>
      <div data-testid="report-on-track">On Track: 0</div>
    </div>
  )
}
