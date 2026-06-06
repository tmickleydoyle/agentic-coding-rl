'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats {
  totalBooks: number
  totalMembers: number
  activeLoans: number
  overdueLoans: number
}

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, totalMembers: 0, activeLoans: 0, overdueLoans: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/books').then(r => r.json()),
      fetch('/api/members').then(r => r.json()),
      fetch('/api/loans').then(r => r.json()),
    ]).then(([books, members, loans]) => {
      const today = new Date().toISOString().slice(0, 10)
      const overdue = loans.filter((l: { dueDate: string; returned: boolean }) => l.dueDate < today && !l.returned).length
      setStats({
        totalBooks: books.length,
        totalMembers: members.length,
        activeLoans: loans.length,
        overdueLoans: overdue,
      })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Library Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-books">{stats.totalBooks}</div>
          <div>Total Books</div>
        </div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-members">{stats.totalMembers}</div>
          <div>Members</div>
        </div>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-active-loans">{stats.activeLoans}</div>
          <div>Active Loans</div>
        </div>
        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-overdue-loans">{stats.overdueLoans}</div>
          <div>Overdue</div>
        </div>
      </div>
    </div>
  )
}
