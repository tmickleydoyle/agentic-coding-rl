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
  return (
    <li data-testid={`expense-${expense.id}`}>
      <span data-testid={`expense-${expense.id}-description`}>{expense.description}</span>
      <span data-testid={`expense-${expense.id}-amount`}>{expense.amount}</span>
      <span data-testid={`expense-${expense.id}-payer`}>{payerName}</span>
      <button data-testid={`remove-${expense.id}`} onClick={() => onRemove(expense.id)}>
        Delete
      </button>
    </li>
  )
}
