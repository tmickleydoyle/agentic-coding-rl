'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Contract, Supplier } from '../../lib/types'

export function ContractsPage() {
  const { triggerRefresh } = useApp()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierId, setSupplierId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [value, setValue] = useState('')

  function load() {
    fetch('/api/contracts').then(r => r.json()).then(setContracts)
    fetch('/api/suppliers').then(r => r.json()).then(setSuppliers)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplierId, startDate, endDate, value: Number(value) }),
    })
    setSupplierId(''); setStartDate(''); setEndDate(''); setValue('')
    load(); triggerRefresh()
  }

  function supplierName(id: string) { return suppliers.find(s => s.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Contracts</h1>
      <form data-testid="add-contract-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-contract-supplier" value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
          <option value="">Select supplier</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="input-contract-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <input data-testid="input-contract-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <input data-testid="input-contract-value" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Value" required />
        <button data-testid="btn-add-contract" type="submit">Add Contract</button>
      </form>
      <ul data-testid="contract-list" style={{ listStyle: 'none', padding: 0 }}>
        {contracts.map(c => (
          <li key={c.id} data-testid="contract-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="contract-supplier" style={{ fontWeight: 'bold' }}>{supplierName(c.supplierId)}</span>
            {' | $'}
            <span data-testid="contract-value">{c.value.toLocaleString()}</span>
            {' | Ends: '}
            <span data-testid="contract-end-date">{c.endDate}</span>
            {' | '}
            <span data-testid="contract-status" style={{ color: c.status === 'active' ? 'green' : 'red' }}>{c.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
