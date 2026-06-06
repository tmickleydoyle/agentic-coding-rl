'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { totalStaff: number; scheduledShifts: number; pendingRequests: number; totalHours: number }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalStaff: 0, scheduledShifts: 0, pendingRequests: 0, totalHours: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/staff').then(r => r.json()),
      fetch('/api/shifts').then(r => r.json()),
      fetch('/api/requests').then(r => r.json()),
    ]).then(([staffList, shiftList, requestList]) => {
      const hours = shiftList.reduce((acc: number, s: { startTime: string; endTime: string }) => {
        const [sh, sm] = s.startTime.split(':').map(Number)
        const [eh, em] = s.endTime.split(':').map(Number)
        return acc + (eh * 60 + em - sh * 60 - sm) / 60
      }, 0)
      setStats({
        totalStaff: staffList.length,
        scheduledShifts: shiftList.length,
        pendingRequests: requestList.filter((r: { status: string }) => r.status === 'pending').length,
        totalHours: Math.round(hours),
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Rota Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-staff">{stats.totalStaff}</div>
          <div>Total Staff</div>
        </div>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-scheduled-shifts">{stats.scheduledShifts}</div>
          <div>Shifts</div>
        </div>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-pending-requests">{stats.pendingRequests}</div>
          <div>Pending Requests</div>
        </div>
        <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-hours">{stats.totalHours}</div>
          <div>Total Hours</div>
        </div>
      </div>
    </div>
  )
}
