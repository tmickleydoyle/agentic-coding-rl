'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Invoice, calcInvoice } from '../../lib/types'
export function InvoicesPage() {
  const { invoices, setInvoices, clients } = useApp()
  const [clientId, setClientId] = useState('')
  const [status, setStatus] = useState<'draft'|'sent'|'paid'>('draft')
  const [taxRate, setTaxRate] = useState('0')
  const [itemsJson, setItemsJson] = useState('[]')

  const handleAdd = () => {
    if (!clientId) return
    let items = []
    try { items = JSON.parse(itemsJson) } catch { items = [] }
    const inv: Invoice = { id: `i${Date.now()}`, clientId, status, items, taxRate: parseFloat(taxRate) || 0, createdAt: new Date().toISOString().slice(0, 10) }
    setInvoices([...invoices, inv])
    setClientId(''); setItemsJson('[]')
  }

  return (
    <div data-testid="invoices-page">
      <h1>Invoices</h1>
      <select data-testid="input-invoice-client" value={clientId} onChange={e => setClientId(e.target.value)}>
        <option value="">Select client</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select data-testid="input-invoice-status" value={status} onChange={e => setStatus(e.target.value as 'draft'|'sent'|'paid')}>
        <option value="draft">draft</option><option value="sent">sent</option><option value="paid">paid</option>
      </select>
      <input data-testid="input-invoice-taxrate" value={taxRate} onChange={e => setTaxRate(e.target.value)} placeholder="Tax Rate" type="number" />
      <textarea data-testid="input-invoice-items" value={itemsJson} onChange={e => setItemsJson(e.target.value)} />
      <button data-testid="add-invoice-btn" onClick={handleAdd}>Add Invoice</button>
      {invoices.map(inv => {
        const { total } = calcInvoice(inv)
        return (
          <div key={inv.id} data-testid={`invoice-item-${inv.id}`}>
            <span>{inv.clientId}</span><span>{inv.status}</span><span>{total}</span>
          </div>
        )
      })}
    </div>
  )
}
