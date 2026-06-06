'use client'
import { useState } from 'react'

const SEED = [
  { id: 1, month: 'Jan 2024', utility: 'Electric', amount: 85, paid: true },
  { id: 2, month: 'Jan 2024', utility: 'Gas', amount: 60, paid: true },
  { id: 3, month: 'Jan 2024', utility: 'Water', amount: 45, paid: false },
  { id: 4, month: 'Feb 2024', utility: 'Electric', amount: 90, paid: true },
  { id: 5, month: 'Feb 2024', utility: 'Gas', amount: 55, paid: false },
  { id: 6, month: 'Feb 2024', utility: 'Water', amount: 42, paid: true },
]

const UTILITY_TYPES = ['Electric', 'Gas', 'Water', 'Internet', 'Other']

export default function App() {
  const [bills, setBills] = useState(SEED.map(b => ({ ...b })))
  const [monthFilter, setMonthFilter] = useState('All')
  const [newMonth, setNewMonth] = useState('')
  const [newUtility, setNewUtility] = useState('Electric')
  const [newAmount, setNewAmount] = useState('')
  const [newPaid, setNewPaid] = useState(false)
  const [nextId, setNextId] = useState(SEED.length + 1)

  const unpaidTotal = bills.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0)
  const allTotal = bills.reduce((s, b) => s + b.amount, 0)

  const months: string[] = []
  bills.forEach(b => {
    if (!months.includes(b.month)) months.push(b.month)
  })

  const visible = monthFilter === 'All' ? bills : bills.filter(b => b.month === monthFilter)

  function markPaid(id: number) {
    setBills(bs => bs.map(b => b.id === id ? { ...b, paid: true } : b))
  }

  function deleteBill(id: number) {
    setBills(bs => bs.filter(b => b.id !== id))
  }

  function addBill() {
    if (!newMonth.trim() || Number(newAmount) <= 0) return
    setBills(bs => [...bs, {
      id: nextId,
      month: newMonth.trim(),
      utility: newUtility,
      amount: Number(newAmount),
      paid: newPaid,
    }])
    setNextId(n => n + 1)
    setNewMonth('')
    setNewAmount('')
    setNewPaid(false)
  }

  return (
    <div>
      <h1>Utility Tracker</h1>

      <div>
        <p data-testid="total-unpaid">Unpaid Total: ${unpaidTotal}</p>
        <p data-testid="total-all">All Bills Total: ${allTotal}</p>
        <p data-testid="bill-count">Bills: {bills.length}</p>
      </div>

      <label>
        Filter by Month
        <select
          aria-label="Filter by Month"
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
        >
          <option value="All">All</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Utility</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(b => (
            <tr key={b.id} data-testid="bill-row">
              <td>{b.month}</td>
              <td>{b.utility}</td>
              <td>${b.amount}</td>
              <td>{b.paid ? 'Paid' : 'Unpaid'}</td>
              <td>
                <button onClick={() => markPaid(b.id)} disabled={b.paid}>Mark Paid</button>
                <button onClick={() => deleteBill(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <label>
          Month
          <input
            aria-label="Month"
            value={newMonth}
            onChange={e => setNewMonth(e.target.value)}
          />
        </label>

        <label>
          Utility
          <select
            aria-label="Utility"
            value={newUtility}
            onChange={e => setNewUtility(e.target.value)}
          >
            {UTILITY_TYPES.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>

        <label>
          Amount
          <input
            aria-label="Amount"
            type="number"
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
          />
        </label>

        <label>
          Paid
          <input
            aria-label="Paid"
            type="checkbox"
            checked={newPaid}
            onChange={e => setNewPaid(e.target.checked)}
          />
        </label>

        <button onClick={addBill}>Add Bill</button>
      </div>
    </div>
  )
}
