'use client'
import { useState } from 'react'
import { useWeight } from '../../components/WeightProvider'

export default function LogPage() {
  const { entries, addEntry } = useWeight()
  const [date, setDate] = useState('2026-05-22')
  const [weight, setWeight] = useState('')
  const [error, setError] = useState('')

  const latest = entries.length === 0 ? null : entries[entries.length - 1]

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(weight)
    if (weight.trim().length === 0 || Number.isNaN(n) || n <= 0) {
      setError('Enter a valid weight')
      return
    }
    if (date.trim().length === 0) {
      setError('Date is required')
      return
    }
    setError('')
    addEntry({ date, weight: n })
    setWeight('')
  }

  return (
    <section data-testid="page-log">
      <h1>Log Weight</h1>
      <p data-testid="latest-weight">{latest ? latest.weight : 'none'}</p>
      <form data-testid="log-form" onSubmit={onSubmit}>
        <input
          type="date"
          data-testid="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          data-testid="weight-input"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-weight">
          Log weight
        </button>
      </form>
    </section>
  )
}
