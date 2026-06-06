'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { calcInvoice } from '../../lib/types'
export function PreviewPage() {
  const { invoices, clients } = useApp()
  const [selectedId, setSelectedId] = useState('')
  const inv = invoices.find(i => i.id === selectedId)
  const client = inv ? clients.find(c => c.id === inv.clientId) : null
  const calc = inv ? calcInvoice(inv) : null
  return (
    <div data-testid="preview-page">
      <h1>Preview</h1>
      <select data-testid="invoice-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
        <option value="">Select invoice</option>
        {invoices.map(i => <option key={i.id} value={i.id}>{i.id}</option>)}
      </select>
      {inv && calc && (
        <div>
          <div data-testid="preview-client">{client?.name ?? inv.clientId}</div>
          <div data-testid="preview-status">{inv.status}</div>
          <div data-testid="preview-subtotal">{calc.subtotal}</div>
          <div data-testid="preview-tax">{calc.tax}</div>
          <div data-testid="preview-total">{calc.total}</div>
          {inv.items.map((item, idx) => (
            <div key={idx} data-testid={`preview-item-${idx}`}>
              {item.description} x{item.qty} @ {item.unitPrice}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
