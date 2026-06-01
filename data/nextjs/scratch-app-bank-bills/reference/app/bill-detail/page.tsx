'use client'
import { useBills } from '../../components/BillsProvider'
import { billStatus } from '../../hooks/useBills'

export default function BillDetailPage() {
  const { bills, selectedId, today, payBill, toggleAutopay } = useBills()
  const bill = bills.find((b) => b.id === selectedId)

  if (!bill) {
    return (
      <section data-testid="page-bill-detail">
        <p data-testid="no-selection">No bill selected.</p>
      </section>
    )
  }

  const status = billStatus(bill, today)

  return (
    <section data-testid="page-bill-detail">
      <h1 data-testid="bill-name">{bill.name}</h1>
      <p data-testid="bill-amount">{bill.amount}</p>
      <p data-testid="bill-due">{bill.dueDay}</p>
      <p data-testid="bill-status">{status}</p>
      {bill.paid ? (
        <p data-testid="already-paid">Already paid</p>
      ) : (
        <button data-testid="pay-button" onClick={() => payBill(bill.id)}>
          Pay bill
        </button>
      )}
      <p data-testid="autopay-state">{bill.autopay ? 'on' : 'off'}</p>
      <button data-testid="autopay-toggle" onClick={() => toggleAutopay(bill.id)}>
        Toggle autopay
      </button>
    </section>
  )
}
