'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { totalItems: number; totalLocations: number; lowStock: number; totalMovements: number }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalItems: 0, totalLocations: 0, lowStock: 0, totalMovements: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/inventory').then(r => r.json()),
      fetch('/api/locations').then(r => r.json()),
      fetch('/api/movements').then(r => r.json()),
    ]).then(([inv, locs, movs]) => {
      setStats({
        totalItems: inv.length,
        totalLocations: locs.length,
        lowStock: inv.filter((i: { quantity: number }) => i.quantity < 10).length,
        totalMovements: movs.length,
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Warehouse Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-items">{stats.totalItems}</div><div>Items</div></div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-locations">{stats.totalLocations}</div><div>Locations</div></div>
        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-low-stock">{stats.lowStock}</div><div>Low Stock</div></div>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-movements">{stats.totalMovements}</div><div>Movements</div></div>
      </div>
    </div>
  )
}
