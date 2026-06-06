'use client'
import { useState } from 'react'

const DEFAULTS = {
  income: 5000,
  rent: 1400,
  utilities: 150,
  parking: 75,
  petFee: 0,
  insurance: 20,
}

type Fields = typeof DEFAULTS

export default function App() {
  const [fields, setFields] = useState<Fields>({ ...DEFAULTS })
  const [results, setResults] = useState<null | {
    total: number
    ratio: string
    affordability: string
    remaining: number
  }>(null)

  function handleChange(key: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields(f => ({ ...f, [key]: Number(e.target.value) }))
    }
  }

  function calculate() {
    const total = fields.rent + fields.utilities + fields.parking + fields.petFee + fields.insurance
    const remaining = fields.income - total
    let ratio: string
    let affordability: string
    if (fields.income === 0) {
      ratio = 'N/A'
      affordability = 'N/A'
    } else {
      const pct = (fields.rent / fields.income) * 100
      ratio = pct.toFixed(1) + '%'
      if (pct <= 30) affordability = 'Affordable'
      else if (pct <= 40) affordability = 'Borderline'
      else affordability = 'Unaffordable'
    }
    setResults({ total, ratio, affordability, remaining })
  }

  function reset() {
    setFields({ ...DEFAULTS })
    setResults(null)
  }

  return (
    <div>
      <h1>Rent Calculator</h1>

      <div>
        <label>
          Monthly Income
          <input
            aria-label="Monthly Income"
            type="number"
            value={fields.income}
            onChange={handleChange('income')}
          />
        </label>

        <label>
          Base Rent
          <input
            aria-label="Base Rent"
            type="number"
            value={fields.rent}
            onChange={handleChange('rent')}
          />
        </label>

        <label>
          Utilities
          <input
            aria-label="Utilities"
            type="number"
            value={fields.utilities}
            onChange={handleChange('utilities')}
          />
        </label>

        <label>
          Parking
          <input
            aria-label="Parking"
            type="number"
            value={fields.parking}
            onChange={handleChange('parking')}
          />
        </label>

        <label>
          Pet Fee
          <input
            aria-label="Pet Fee"
            type="number"
            value={fields.petFee}
            onChange={handleChange('petFee')}
          />
        </label>

        <label>
          Renters Insurance
          <input
            aria-label="Renters Insurance"
            type="number"
            value={fields.insurance}
            onChange={handleChange('insurance')}
          />
        </label>
      </div>

      <button onClick={calculate}>Calculate</button>
      <button onClick={reset}>Reset</button>

      {results && (
        <div>
          <p data-testid="total-cost">Total Monthly Cost: ${results.total}</p>
          <p data-testid="income-ratio">Rent-to-Income Ratio: {results.ratio}</p>
          <p data-testid="affordability">Affordability: {results.affordability}</p>
          <p data-testid="monthly-remaining">Monthly Remaining: ${results.remaining}</p>
        </div>
      )}
    </div>
  )
}
