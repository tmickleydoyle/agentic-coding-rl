'use client'
import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { CATEGORIES } from '../lib/types'
import type { TxnType } from '../lib/types'

export function Transactions() {
  const { txns, addTxn, expensesOnly } = useFinance()
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TxnType>('expense')

  const visible = txns.filter((t) => !expensesOnly || t.type === 'expense')

  return (
    <section aria-label="Transactions view">
      <h1>Transactions</h1>
      <input aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input aria-label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as TxnType)}>
        <option value="income">income</option>
        <option value="expense">expense</option>
      </select>
      <button
        onClick={() => {
          addTxn(description, category, amount, type)
          setDescription('')
          setAmount('')
        }}
      >
        Add transaction
      </button>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            {`${t.description}: ${t.type === 'expense' ? '-' : '+'}$${t.amount} (${t.category})`}
          </li>
        ))}
      </ul>
    </section>
  )
}
