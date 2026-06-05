'use client'
import { useState } from 'react'
import { useRebalance } from '../../components/RebalanceProvider'
import { totalTargetPercent } from '../../hooks/useRebalance'

export default function TargetsPage() {
  const { holdings, setTarget, addHolding } = useRebalance()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [target, setTargetInput] = useState('')
  const [error, setError] = useState('')

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedValue = Number(value)
    const parsedTarget = Number(target)
    if (symbol.trim().length === 0) {
      setError('Symbol is required')
      return
    }
    if (value.trim().length === 0 || Number.isNaN(parsedValue) || parsedValue <= 0) {
      setError('Enter a positive value')
      return
    }
    if (target.trim().length === 0 || Number.isNaN(parsedTarget) || parsedTarget < 0) {
      setError('Enter a target percent')
      return
    }
    setError('')
    addHolding({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim().length === 0 ? symbol.trim().toUpperCase() : name.trim(),
      value: parsedValue,
      targetPercent: parsedTarget,
    })
    setSymbol('')
    setName('')
    setValue('')
    setTargetInput('')
  }

  return (
    <section data-testid="page-targets">
      <h1>Targets</h1>
      <p data-testid="target-total">{totalTargetPercent(holdings)}</p>
      {totalTargetPercent(holdings) === 100 ? (
        <p data-testid="target-valid">Targets sum to 100%</p>
      ) : (
        <p data-testid="target-invalid">Targets do not sum to 100%</p>
      )}
      <ul data-testid="target-list">
        {holdings.map((h) => (
          <li key={h.id} data-testid={`target-${h.id}`}>
            <span data-testid={`target-${h.id}-symbol`}>{h.symbol}</span>
            <span data-testid={`target-${h.id}-percent`}>{h.targetPercent}</span>
            <button
              data-testid={`target-up-${h.id}`}
              onClick={() => setTarget(h.id, h.targetPercent + 5)}
            >
              +5
            </button>
            <button
              data-testid={`target-down-${h.id}`}
              onClick={() => setTarget(h.id, Math.max(0, h.targetPercent - 5))}
            >
              -5
            </button>
          </li>
        ))}
      </ul>
      <form data-testid="holding-form" onSubmit={onAdd}>
        <input data-testid="symbol-input" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <input data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="value-input" value={value} onChange={(e) => setValue(e.target.value)} />
        <input
          data-testid="target-input"
          value={target}
          onChange={(e) => setTargetInput(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-holding">
          Add holding
        </button>
      </form>
    </section>
  )
}
