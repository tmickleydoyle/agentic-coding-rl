'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { totalSuppliers: number; activeContracts: number; totalContacts: number; expiredContracts: number }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalSuppliers: 0, activeContracts: 0, totalContacts: 0, expiredContracts: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/suppliers').then(r => r.json()),
      fetch('/api/contacts').then(r => r.json()),
      fetch('/api/contracts').then(r => r.json()),
    ]).then(([supps, conts, contracts]) => {
      setStats({
        totalSuppliers: supps.length,
        activeContracts: contracts.filter((c: { status: string }) => c.status === 'active').length,
        totalContacts: conts.length,
        expiredContracts: contracts.filter((c: { status: string }) => c.status === 'expired').length,
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supplier Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-suppliers">{stats.totalSuppliers}</div><div>Suppliers</div></div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-active-contracts">{stats.activeContracts}</div><div>Active Contracts</div></div>
        <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-contacts">{stats.totalContacts}</div><div>Contacts</div></div>
        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-expired-contracts">{stats.expiredContracts}</div><div>Expired</div></div>
      </div>
    </div>
  )
}
