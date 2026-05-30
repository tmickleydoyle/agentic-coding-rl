'use client'
import { useBills } from './BillsProvider'
import { billStatus } from '../hooks/useBills'
import type { Bill } from '../lib/types'

export default function BillRow({ bill }: { bill: Bill }) {
  const { select, today } = useBills()
  // TODO: render the bill name/amount/due/status and an open button that calls select(id).
  void select
  void today
  void billStatus
  return <li data-testid={`bill-${bill.id}`} data-paid={bill.paid ? 'true' : 'false'} />
}
