'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { totalOrders: number; inTransit: number; openReturns: number; delivered: number }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, inTransit: 0, openReturns: 0, delivered: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/shipments').then(r => r.json()),
      fetch('/api/returns').then(r => r.json()),
    ]).then(([orders, shipments, returns]) => {
      setStats({
        totalOrders: orders.length,
        inTransit: shipments.filter((s: { status: string }) => s.status === 'in_transit').length,
        openReturns: returns.filter((r: { status: string }) => r.status === 'open').length,
        delivered: orders.filter((o: { status: string }) => o.status === 'delivered').length,
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Order Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-orders">{stats.totalOrders}</div><div>Total Orders</div></div>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-in-transit">{stats.inTransit}</div><div>In Transit</div></div>
        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-open-returns">{stats.openReturns}</div><div>Open Returns</div></div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-delivered">{stats.delivered}</div><div>Delivered</div></div>
      </div>
    </div>
  )
}
