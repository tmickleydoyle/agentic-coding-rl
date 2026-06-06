'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { openTickets: number; totalOrders: number; resolvedTickets: number; pendingOrders: number }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ openTickets: 0, totalOrders: 0, resolvedTickets: 0, pendingOrders: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
    ]).then(([tickets, orders]) => {
      setStats({
        openTickets: tickets.filter((t: { status: string }) => t.status === 'open').length,
        totalOrders: orders.length,
        resolvedTickets: tickets.filter((t: { status: string }) => t.status === 'resolved').length,
        pendingOrders: orders.filter((o: { status: string }) => o.status === 'pending').length,
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-open-tickets">{stats.openTickets}</div>
          <div>Open Tickets</div>
        </div>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-orders">{stats.totalOrders}</div>
          <div>Total Orders</div>
        </div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-resolved-tickets">{stats.resolvedTickets}</div>
          <div>Resolved</div>
        </div>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-pending-orders">{stats.pendingOrders}</div>
          <div>Pending Orders</div>
        </div>
      </div>
    </div>
  )
}
