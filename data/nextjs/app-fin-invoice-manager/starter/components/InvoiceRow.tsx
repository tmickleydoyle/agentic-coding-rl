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
  // TODO: render the invoice row with client name, amount, status, mark-paid + remove buttons
  void clientName
  void onMarkPaid
  void onRemove
  return <li data-testid={`invoice-${invoice.id}`} data-status={invoice.status} />
}
