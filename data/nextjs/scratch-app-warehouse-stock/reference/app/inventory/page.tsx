'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { InventoryItem, Location } from '../../lib/types'

export function InventoryPage() {
  const { triggerRefresh } = useApp()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState('')
  const [locationId, setLocationId] = useState('')
  const [category, setCategory] = useState('')

  function load() {
    fetch('/api/inventory').then(r => r.json()).then(setItems)
    fetch('/api/locations').then(r => r.json()).then(setLocations)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, sku, quantity: Number(quantity), locationId, category }),
    })
    setName(''); setSku(''); setQuantity(''); setLocationId(''); setCategory('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Inventory</h1>
      <form data-testid="add-inventory-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-item-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-item-sku" value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU" required />
        <input data-testid="input-item-quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" required />
        <select data-testid="select-item-location" value={locationId} onChange={e => setLocationId(e.target.value)} required>
          <option value="">Select location</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.code}</option>)}
        </select>
        <input data-testid="input-item-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
        <button data-testid="btn-add-item" type="submit">Add Item</button>
      </form>
      <ul data-testid="inventory-list" style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} data-testid="inventory-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem', background: item.quantity < 10 ? '#fff5f5' : undefined }}>
            <span data-testid="item-name" style={{ fontWeight: 'bold' }}>{item.name}</span>
            {' | '}
            <span data-testid="item-sku">{item.sku}</span>
            {' | Qty: '}
            <span data-testid="item-quantity">{item.quantity}</span>
            {' | '}
            <span data-testid="item-category">{item.category}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
