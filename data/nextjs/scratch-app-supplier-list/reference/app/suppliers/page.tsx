'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Supplier } from '../../lib/types'

export function SuppliersPage() {
  const { triggerRefresh } = useApp()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')

  function load() { fetch('/api/suppliers').then(r => r.json()).then(setSuppliers) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, country }),
    })
    setName(''); setCategory(''); setCountry('')
    load(); triggerRefresh()
  }

  async function handleToggle(id: string) {
    await fetch(`/api/suppliers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } })
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Suppliers</h1>
      <form data-testid="add-supplier-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-supplier-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-supplier-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
        <input data-testid="input-supplier-country" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" required />
        <button data-testid="btn-add-supplier" type="submit">Add Supplier</button>
      </form>
      <ul data-testid="supplier-list" style={{ listStyle: 'none', padding: 0 }}>
        {suppliers.map(s => (
          <li key={s.id} data-testid="supplier-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <span data-testid="supplier-name" style={{ fontWeight: 'bold' }}>{s.name}</span>
              {' | '}
              <span data-testid="supplier-category">{s.category}</span>
              {' | '}
              <span data-testid="supplier-country">{s.country}</span>
              {' | '}
              <span data-testid="supplier-status" style={{ color: s.status === 'active' ? 'green' : 'gray' }}>{s.status}</span>
            </span>
            <button data-testid="btn-toggle-supplier" onClick={() => handleToggle(s.id)}>{s.status === 'active' ? 'Deactivate' : 'Activate'}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
