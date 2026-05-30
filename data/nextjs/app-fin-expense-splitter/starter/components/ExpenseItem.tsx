'use client'
import type { Expense } from '../lib/types'

export default function ExpenseItem({
  expense,
  payerName,
  onRemove,
}: {
  expense: Expense
  payerName: string
  onRemove: (id: string) => void
}) {
  // TODO: render <li data-testid="expense-<id>"> with description, amount, payerName and a
  // remove-<id> button.
  void payerName
  void onRemove
  return <li data-testid={`expense-${expense.id}`} />
}
