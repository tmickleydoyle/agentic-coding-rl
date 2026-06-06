'use client'
import { useState } from 'react'

interface LineItem {
  id: number
  description: string
  qty: number
  unitPrice: number
}

const SEED_ITEMS: LineItem[] = [
  { id: 1, description: 'Web Design', qty: 2, unitPrice: 500.00 },
  { id: 2, description: 'Logo Design', qty: 1, unitPrice: 250.00 },
]

let nextId = 3

function fmt(n: number): string {
  return '$' + n.toFixed(2)
}

export default function App() {
  const [clientName, setClientName] = useState('Acme Corp')
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001')
  const [items, setItems] = useState<LineItem[]>(SEED_ITEMS.map(x => ({ ...x })))
  const [taxRate, setTaxRate] = useState(10)

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
  const taxAmount = subtotal * taxRate / 100
  const total = subtotal + taxAmount

  function addItem() {
    setItems(xs => [...xs, { id: nextId++, description: '', qty: 1, unitPrice: 0 }])
  }

  function removeItem(id: number) {
    setItems(xs => xs.filter(x => x.id !== id))
  }

  function updateItem(id: number, field: keyof LineItem, value: string | number) {
    setItems(xs => xs.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  return (
    <div>
      <h1>Invoice Builder</h1>

      <div>
        <label>
          Client Name
          <input
            aria-label="Client Name"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
          />
        </label>
        <label>
          Invoice Number
          <input
            aria-label="Invoice Number"
            value={invoiceNumber}
            onChange={e => setInvoiceNumber(e.target.value)}
          />
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Line Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const i = idx + 1
            const lineTotal = item.qty * item.unitPrice
            return (
              <tr key={item.id} data-testid="line-item">
                <td>
                  <input
                    aria-label={`Description ${i}`}
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Qty ${i}`}
                    type="number"
                    value={item.qty}
                    onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Unit Price ${i}`}
                    type="number"
                    value={item.unitPrice}
                    onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td data-testid="line-total">{fmt(lineTotal)}</td>
                <td>
                  <button aria-label={`Remove ${i}`} onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <button onClick={addItem}>Add Item</button>

      <div>
        <p data-testid="subtotal">Subtotal: {fmt(subtotal)}</p>
        <label>
          Tax Rate
          <input
            aria-label="Tax Rate"
            type="number"
            value={taxRate}
            onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
          />
        </label>
        <p data-testid="tax-amount">Tax: {fmt(taxAmount)}</p>
        <p data-testid="invoice-total">Total: {fmt(total)}</p>
      </div>
    </div>
  )
}
