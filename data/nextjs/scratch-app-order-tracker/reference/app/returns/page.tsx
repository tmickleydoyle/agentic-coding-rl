'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Return, Order } from '../../lib/types'

export function ReturnsPage() {
  const { triggerRefresh } = useApp()
  const [returns, setReturns] = useState<Return[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderId, setOrderId] = useState('')
  const [reason, setReason] = useState('')

  function load() {
    fetch('/api/returns').then(r => r.json()).then(setReturns)
    fetch('/api/orders').then(r => r.json()).then(setOrders)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, reason }),
    })
    setOrderId(''); setReason('')
    load(); triggerRefresh()
  }

  function orderNum(id: string) { return orders.find(o => o.id === id)?.orderNumber ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Returns</h1>
      <form data-testid="add-return-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-return-order" value={orderId} onChange={e => setOrderId(e.target.value)} required>
          <option value="">Select order</option>
          {orders.map(o => <option key={o.id} value={o.id}>{o.orderNumber}</option>)}
        </select>
        <input data-testid="input-return-reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" required />
        <button data-testid="btn-add-return" type="submit">Submit Return</button>
      </form>
      <ul data-testid="return-list" style={{ listStyle: 'none', padding: 0 }}>
        {returns.map(r => (
          <li key={r.id} data-testid="return-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="return-order" style={{ fontWeight: 'bold' }}>{orderNum(r.orderId)}</span>
            {' | '}
            <span data-testid="return-reason">{r.reason}</span>
            {' | '}
            <span data-testid="return-status">{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
