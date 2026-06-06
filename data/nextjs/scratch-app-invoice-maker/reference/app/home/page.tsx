'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
import { calcInvoice } from '../../lib/types'
export function HomePage() {
  const { invoices, clients } = useApp()
  const revenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + calcInvoice(i).total, 0)
  return (
    <div data-testid="home-page">
      <h1>Invoice Maker</h1>
      <div data-testid="total-invoices">{invoices.length}</div>
      <div data-testid="total-clients">{clients.length}</div>
      <div data-testid="total-revenue">{revenue}</div>
    </div>
  )
}
