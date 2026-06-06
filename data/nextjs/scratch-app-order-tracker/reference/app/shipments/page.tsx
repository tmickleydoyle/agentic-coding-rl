'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Shipment, Order } from '../../lib/types'

export function ShipmentsPage() {
  const { triggerRefresh } = useApp()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderId, setOrderId] = useState('')
  const [carrier, setCarrier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')

  function load() {
    fetch('/api/shipments').then(r => r.json()).then(setShipments)
    fetch('/api/orders').then(r => r.json()).then(setOrders)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, carrier, trackingNumber, estimatedDelivery }),
    })
    setOrderId(''); setCarrier(''); setTrackingNumber(''); setEstimatedDelivery('')
    load(); triggerRefresh()
  }

  function orderNum(id: string) { return orders.find(o => o.id === id)?.orderNumber ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Shipments</h1>
      <form data-testid="add-shipment-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-shipment-order" value={orderId} onChange={e => setOrderId(e.target.value)} required>
          <option value="">Select order</option>
          {orders.map(o => <option key={o.id} value={o.id}>{o.orderNumber}</option>)}
        </select>
        <input data-testid="input-shipment-carrier" value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="Carrier" required />
        <input data-testid="input-shipment-tracking" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Tracking Number" required />
        <input data-testid="input-shipment-delivery" type="date" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} required />
        <button data-testid="btn-add-shipment" type="submit">Add Shipment</button>
      </form>
      <ul data-testid="shipment-list" style={{ listStyle: 'none', padding: 0 }}>
        {shipments.map(s => (
          <li key={s.id} data-testid="shipment-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="shipment-order" style={{ fontWeight: 'bold' }}>{orderNum(s.orderId)}</span>
            {' | '}
            <span data-testid="shipment-carrier">{s.carrier}</span>
            {' | '}
            <span data-testid="shipment-tracking">{s.trackingNumber}</span>
            {' | '}
            <span data-testid="shipment-status">{s.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
