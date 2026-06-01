'use client'
import { useFinance } from '../hooks/useFinance'

export function Reports() {
  const { txns } = useFinance()
  const income = txns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = txns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense
  const rate = income === 0 ? 0 : Math.round(((income - expense) / income) * 100)
  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total income: $${income}`}</p>
      <p>{`Total expense: $${expense}`}</p>
      <p>{`Balance: $${balance}`}</p>
      <p>{`Savings rate: ${rate}%`}</p>
    </section>
  )
}
