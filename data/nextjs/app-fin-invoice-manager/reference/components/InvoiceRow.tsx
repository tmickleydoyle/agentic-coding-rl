'use client'
import type { Invoice } from '../lib/types'

export default function InvoiceRow({
  invoice,
  clientName,
  onMarkPaid,
  onRemove,
}: {
  invoice: Invoice
  clientName: string
  onMarkPaid: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`invoice-${invoice.id}`} data-status={invoice.status}>
      <span data-testid={`invoice-${invoice.id}-client`}>{clientName}</span>
      <span data-testid={`invoice-${invoice.id}-amount`}>{invoice.amount}</span>
      <span data-testid={`invoice-${invoice.id}-status`}>{invoice.status}</span>
      <span data-testid={`invoice-${invoice.id}-due`}>{invoice.dueDate}</span>
      <button data-testid={`mark-paid-${invoice.id}`} onClick={() => onMarkPaid(invoice.id)}>
        Mark paid
      </button>
      <button data-testid={`remove-${invoice.id}`} onClick={() => onRemove(invoice.id)}>
        Delete
      </button>
    </li>
  )
}
