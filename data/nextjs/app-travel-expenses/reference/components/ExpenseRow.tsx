'use client'
import type { Expense } from '../lib/types'

export default function ExpenseRow({
  expense,
  onRemove,
}: {
  expense: Expense
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`expense-${expense.id}`}>
      <span data-testid={`expense-${expense.id}-note`}>{expense.note}</span>
      <span data-testid={`expense-${expense.id}-category`}>{expense.category}</span>
      <span data-testid={`expense-${expense.id}-amount`}>{expense.amount}</span>
      <button data-testid={`remove-${expense.id}`} onClick={() => onRemove(expense.id)}>
        Remove
      </button>
    </li>
  )
}
