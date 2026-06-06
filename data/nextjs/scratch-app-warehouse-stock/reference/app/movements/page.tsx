'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Movement, InventoryItem } from '../../lib/types'

export function MovementsPage() {
  const { triggerRefresh } = useApp()
  const [movements, setMovements] = useState<Movement[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [itemId, setItemId] = useState('')
  const [type, setType] = useState<'inbound' | 'outbound'>('inbound')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  function load() {
    fetch('/api/movements').then(r => r.json()).then(setMovements)
    fetch('/api/inventory').then(r => r.json()).then(setItems)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, type, quantity: Number(quantity), notes }),
    })
    setItemId(''); setType('inbound'); setQuantity(''); setNotes('')
    load(); triggerRefresh()
  }

  function itemName(id: string) { return items.find(i => i.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Stock Movements</h1>
      <form data-testid="add-movement-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-movement-item" value={itemId} onChange={e => setItemId(e.target.value)} required>
          <option value="">Select item</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select data-testid="select-movement-type" value={type} onChange={e => setType(e.target.value as 'inbound' | 'outbound')}>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
        </select>
        <input data-testid="input-movement-quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" required />
        <input data-testid="input-movement-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="btn-add-movement" type="submit">Record Movement</button>
      </form>
      <ul data-testid="movement-list" style={{ listStyle: 'none', padding: 0 }}>
        {movements.map(m => (
          <li key={m.id} data-testid="movement-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="movement-item-name" style={{ fontWeight: 'bold' }}>{itemName(m.itemId)}</span>
            {' | '}
            <span data-testid="movement-type" style={{ color: m.type === 'inbound' ? 'green' : 'red' }}>{m.type}</span>
            {' | Qty: '}
            <span data-testid="movement-quantity">{m.quantity}</span>
            {' | '}
            <span data-testid="movement-date">{m.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
