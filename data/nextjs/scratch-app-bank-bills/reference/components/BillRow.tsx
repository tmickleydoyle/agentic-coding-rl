'use client'
import { useBills } from './BillsProvider'
import { billStatus } from '../hooks/useBills'
import type { Bill } from '../lib/types'

export default function BillRow({ bill }: { bill: Bill }) {
  const { select, today } = useBills()
  const status = billStatus(bill, today)
  return (
    <li data-testid={`bill-${bill.id}`} data-paid={bill.paid ? 'true' : 'false'}>
      <span data-testid={`bill-${bill.id}-name`}>{bill.name}</span>
      <span data-testid={`bill-${bill.id}-amount`}>{bill.amount}</span>
      <span data-testid={`bill-${bill.id}-due`}>{bill.dueDay}</span>
      <span data-testid={`bill-${bill.id}-status`}>{status}</span>
      <button data-testid={`bill-${bill.id}-open`} onClick={() => select(bill.id)}>
        Open
      </button>
    </li>
  )
}
