'use client'
import { useState } from 'react'

interface Debt {
  id: number
  name: string
  balance: number
  interestRate: number
  minPayment: number
}

const SEED: Debt[] = [
  { id: 1, name: 'Credit Card', balance: 3500, interestRate: 19.99, minPayment: 75 },
  { id: 2, name: 'Car Loan', balance: 12000, interestRate: 5.50, minPayment: 250 },
  { id: 3, name: 'Medical Bill', balance: 1200, interestRate: 0, minPayment: 50 },
]

let nextId = 4

export default function App() {
  const [debts, setDebts] = useState<Debt[]>(SEED.map(x => ({ ...x })))
  const [paymentInputs, setPaymentInputs] = useState<Record<number, string>>({})
  const [activePayment, setActivePayment] = useState<number | null>(null)

  const [nameInput, setNameInput] = useState('')
  const [balanceInput, setBalanceInput] = useState('')
  const [rateInput, setRateInput] = useState('')
  const [minInput, setMinInput] = useState('')

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0)
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0)
  const debtsRemaining = debts.filter(d => d.balance > 0).length

  function openPayment(id: number) {
    setActivePayment(id)
    setPaymentInputs(prev => ({ ...prev, [id]: '' }))
  }

  function confirmPayment(id: number) {
    const amount = parseFloat(paymentInputs[id] || '0') || 0
    if (amount <= 0) {
      setActivePayment(null)
      return
    }
    setDebts(xs => xs.map(d => d.id === id ? { ...d, balance: Math.max(0, d.balance - amount) } : d))
    setActivePayment(null)
    setPaymentInputs(prev => ({ ...prev, [id]: '' }))
  }

  function addDebt() {
    if (!nameInput.trim()) return
    setDebts(xs => [...xs, {
      id: nextId++,
      name: nameInput.trim(),
      balance: parseFloat(balanceInput) || 0,
      interestRate: parseFloat(rateInput) || 0,
      minPayment: parseFloat(minInput) || 0,
    }])
    setNameInput('')
    setBalanceInput('')
    setRateInput('')
    setMinInput('')
  }

  return (
    <div>
      <h1>Debt Tracker</h1>

      <ul>
        {debts.map(debt => (
          <li key={debt.id} data-testid="debt-row">
            <span>{debt.name}</span>
            <span data-testid="debt-balance">${debt.balance.toFixed(2)}</span>
            <span>{debt.interestRate.toFixed(2)}%</span>
            <span>${debt.minPayment.toFixed(2)}</span>
            {debt.balance === 0 && <span data-testid="paid-off-badge">Paid Off</span>}
            {debt.balance > 0 && (
              <button onClick={() => openPayment(debt.id)}>Make Payment</button>
            )}
            {activePayment === debt.id && (
              <span>
                <input
                  aria-label={`Payment for ${debt.name}`}
                  type="number"
                  value={paymentInputs[debt.id] || ''}
                  onChange={e => setPaymentInputs(prev => ({ ...prev, [debt.id]: e.target.value }))}
                />
                <button onClick={() => confirmPayment(debt.id)}>Confirm</button>
              </span>
            )}
          </li>
        ))}
      </ul>

      <div>
        <p data-testid="total-debt">Total Debt: ${totalDebt.toFixed(2)}</p>
        <p data-testid="total-min-payment">Total Min Payment: ${totalMin.toFixed(2)}</p>
        <p data-testid="debts-remaining">Debts Remaining: {debtsRemaining}</p>
      </div>

      <div>
        <h2>Add Debt</h2>
        <input
          aria-label="Debt Name"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          placeholder="Debt Name"
        />
        <input
          aria-label="Balance"
          type="number"
          value={balanceInput}
          onChange={e => setBalanceInput(e.target.value)}
          placeholder="Balance"
        />
        <input
          aria-label="Interest Rate"
          type="number"
          value={rateInput}
          onChange={e => setRateInput(e.target.value)}
          placeholder="Interest Rate"
        />
        <input
          aria-label="Min Payment"
          type="number"
          value={minInput}
          onChange={e => setMinInput(e.target.value)}
          placeholder="Min Payment"
        />
        <button onClick={addDebt} disabled={!nameInput.trim()}>Add Debt</button>
      </div>
    </div>
  )
}
