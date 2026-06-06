'use client'
import { useState } from 'react'

interface Coin {
  key: string
  label: string
  value: number
}

const COINS: Coin[] = [
  { key: 'pennies', label: 'Pennies', value: 1 },
  { key: 'nickels', label: 'Nickels', value: 5 },
  { key: 'dimes', label: 'Dimes', value: 10 },
  { key: 'quarters', label: 'Quarters', value: 25 },
  { key: 'half-dollars', label: 'Half Dollars', value: 50 },
  { key: 'dollar-coins', label: 'Dollar Coins', value: 100 },
]

const INITIAL_QUANTITIES: Record<string, number> = {}
COINS.forEach(c => { INITIAL_QUANTITIES[c.key] = 0 })

export default function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>({ ...INITIAL_QUANTITIES })

  function updateQuantity(key: string, raw: string) {
    const parsed = parseInt(raw, 10)
    const val = isNaN(parsed) ? 0 : Math.max(0, parsed)
    setQuantities(prev => ({ ...prev, [key]: val }))
  }

  function reset() {
    const reset: Record<string, number> = {}
    COINS.forEach(c => { reset[c.key] = 0 })
    setQuantities(reset)
  }

  const subtotals: Record<string, number> = {}
  COINS.forEach(c => { subtotals[c.key] = quantities[c.key] * c.value })

  const totalCents = COINS.reduce((sum, c) => sum + subtotals[c.key], 0)
  const totalDollars = (totalCents / 100).toFixed(2)

  return (
    <div>
      <h1>Coin Counter</h1>

      {COINS.map(coin => (
        <div key={coin.key}>
          <label htmlFor={`input-${coin.key}`}>{coin.label}</label>
          <input
            id={`input-${coin.key}`}
            data-testid={`input-${coin.key}`}
            type="number"
            min={0}
            value={quantities[coin.key]}
            onChange={e => updateQuantity(coin.key, e.target.value)}
          />
          <span data-testid={`subtotal-${coin.key}`}>= {subtotals[coin.key]}¢</span>
        </div>
      ))}

      <div>
        <span data-testid="total-cents">Total Cents: {totalCents}</span>
      </div>
      <div>
        <span data-testid="total-dollars">Total: ${totalDollars}</span>
      </div>

      <button data-testid="count-btn" onClick={() => {}}>Count Coins</button>
      <button data-testid="reset-btn" onClick={reset}>Reset</button>
    </div>
  )
}
