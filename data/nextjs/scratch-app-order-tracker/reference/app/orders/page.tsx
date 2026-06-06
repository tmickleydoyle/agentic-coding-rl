'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Order } from '../../lib/types'

export function OrdersPage() {
  const { triggerRefresh } = useApp()
  const [orders, setOrders] = useState<Order[]>([])
  const [orderNumber, setOrderNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [date, setDate] = useState('')
  const [total, setTotal] = useState('')

  function load() { fetch('/api/orders').then(r => r.json()).then(setOrders) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, customerName, date, total: Number(total) }),
    })
    setOrderNumber(''); setCustomerName(''); setDate(''); setTotal('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Orders</h1>
      <form data-testid="add-order-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-order-number" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="Order Number" required />
        <input data-testid="input-order-customer" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer Name" required />
        <input data-testid="input-order-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input data-testid="input-order-total" type="number" step="0.01" value={total} onChange={e => setTotal(e.target.value)} placeholder="Total" required />
        <button data-testid="btn-add-order" type="submit">Add Order</button>
      </form>
      <ul data-testid="order-list" style={{ listStyle: 'none', padding: 0 }}>
        {orders.map(o => (
          <li key={o.id} data-testid="order-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="order-number" style={{ fontWeight: 'bold' }}>{o.orderNumber}</span>
            {' | '}
            <span data-testid="order-customer">{o.customerName}</span>
            {' | $'}
            <span data-testid="order-total">{o.total.toFixed(2)}</span>
            {' | '}
            <span data-testid="order-status">{o.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
