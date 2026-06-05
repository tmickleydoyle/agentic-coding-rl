'use client'
import { useState } from 'react'
import { useLedger } from '../hooks/useLedger'
import type { Category, EntryType } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export function Ledger() {
  const { entries, addEntry } = useLedger()
  const [memo, setMemo] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Sales')
  const [type, setType] = useState<EntryType>('in')

  let running = 0
  const rows = entries.map((e) => {
    running += e.type === 'in' ? e.amount : -e.amount
    const sign = e.type === 'in' ? '+' : '-'
    return { id: e.id, text: `${e.memo}: ${sign}$${e.amount} [${e.category}] balance $${running}` }
  })

  return (
    <section aria-label="Ledger view">
      <h1>Ledger</h1>
      <input aria-label="Memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
      <input aria-label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as EntryType)}>
        <option value="in">in</option>
        <option value="out">out</option>
      </select>
      <button
        onClick={() => {
          addEntry(memo, amount, category, type)
          setMemo('')
          setAmount('')
        }}
      >
        Add entry
      </button>
      <ul>
        {rows.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </section>
  )
}
