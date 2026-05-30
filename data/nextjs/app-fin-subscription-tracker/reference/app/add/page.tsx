'use client'
import { useState } from 'react'
import { useSubs } from '../../components/SubsProvider'
import type { Cycle } from '../../lib/types'

export default function AddPage() {
  const { addSubscription, navigate } = useSubs()
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [cycle, setCycle] = useState<Cycle>('monthly')
  const [nextRenewal, setNextRenewal] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(cost)
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    if (cost.trim().length === 0 || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a positive cost')
      return
    }
    if (nextRenewal.trim().length === 0) {
      setError('Next renewal date is required')
      return
    }
    setError('')
    addSubscription({ name: name.trim(), cost: parsed, cycle, nextRenewal })
    setName('')
    setCost('')
    setNextRenewal('')
    navigate('subscriptions')
  }

  return (
    <section data-testid="page-add">
      <h1>Add subscription</h1>
      <form data-testid="sub-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          data-testid="cost-input"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <select
          data-testid="cycle-select"
          value={cycle}
          onChange={(e) => setCycle(e.target.value as Cycle)}
        >
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
        <input
          type="date"
          data-testid="renewal-input"
          value={nextRenewal}
          onChange={(e) => setNextRenewal(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-sub">
          Add subscription
        </button>
      </form>
    </section>
  )
}
