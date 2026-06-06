'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function ReportsPage() {
  const { goals } = useApp()
  const today = new Date().toISOString().slice(0, 10)

  const completed = goals.filter(g => g.currentAmount >= g.targetAmount)
  const atRisk = goals.filter(g => g.currentAmount < g.targetAmount && g.deadline < today)
  const onTrack = goals.filter(g => g.currentAmount < g.targetAmount && g.deadline >= today)

  return (
    <div data-testid="reports-page">
      <h1>Reports</h1>
      <div data-testid="report-completed">
        <strong>Completed:</strong> {completed.length}
      </div>
      <div data-testid="report-at-risk">
        <strong>At Risk:</strong> {atRisk.length}
      </div>
      <div data-testid="report-on-track">
        <strong>On Track:</strong> {onTrack.length}
      </div>
    </div>
  )
}
