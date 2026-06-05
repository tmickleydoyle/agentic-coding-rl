'use client'
import { useState } from 'react'
import { useBills } from '../../components/BillsProvider'

export default function AddPage() {
  const { addBill, navigate } = useBills()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [autopay, setAutopay] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = Number(amount)
    const parsedDue = Number(dueDay)
    if (name.trim().length === 0) {
      setError('Enter a name')
      return
    }
    if (amount.trim().length === 0 || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a positive amount')
      return
    }
    if (
      dueDay.trim().length === 0 ||
      !Number.isInteger(parsedDue) ||
      parsedDue < 1 ||
      parsedDue > 31
    ) {
      setError('Enter a due day between 1 and 31')
      return
    }
    setError('')
    addBill({ name: name.trim(), amount: parsedAmount, dueDay: parsedDue, autopay })
    navigate('bills')
  }

  return (
    <section data-testid="page-add">
      <h1>Add bill</h1>
      <form data-testid="bill-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="dueday">Due day</label>
        <input
          id="dueday"
          data-testid="dueday-input"
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
        />

        <label htmlFor="autopay">Autopay</label>
        <input
          id="autopay"
          type="checkbox"
          data-testid="autopay-checkbox"
          checked={autopay}
          onChange={(e) => setAutopay(e.target.checked)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-bill">
          Add bill
        </button>
      </form>
    </section>
  )
}
