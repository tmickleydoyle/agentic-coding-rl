'use client'
import { useState } from 'react'

type Unit = 'metric' | 'imperial'

function getCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25.0) return 'Normal weight'
  if (bmi < 30.0) return 'Overweight'
  return 'Obese'
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('metric')
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightLbs, setWeightLbs] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')

  function switchUnit(u: Unit) {
    setUnit(u)
    setWeightKg('')
    setHeightCm('')
    setWeightLbs('')
    setHeightFt('')
    setHeightIn('')
  }

  function reset() {
    setUnit('metric')
    setWeightKg('')
    setHeightCm('')
    setWeightLbs('')
    setHeightFt('')
    setHeightIn('')
  }

  let bmi: number | null = null

  if (unit === 'metric') {
    const w = parseFloat(weightKg)
    const h = parseFloat(heightCm) / 100
    if (w > 0 && h > 0) {
      bmi = w / (h * h)
    }
  } else {
    const w = parseFloat(weightLbs)
    const ft = parseFloat(heightFt) || 0
    const inches = parseFloat(heightIn) || 0
    const totalIn = ft * 12 + inches
    if (w > 0 && totalIn > 0) {
      bmi = (703 * w) / (totalIn * totalIn)
    }
  }

  const bmiDisplay = bmi !== null ? bmi.toFixed(1) : '--'
  const categoryDisplay = bmi !== null ? getCategory(bmi) : '--'

  return (
    <div>
      <h1>BMI Calculator</h1>

      <div>
        <button
          role="radio"
          aria-checked={unit === 'metric'}
          onClick={() => switchUnit('metric')}
        >
          Metric
        </button>
        <button
          role="radio"
          aria-checked={unit === 'imperial'}
          onClick={() => switchUnit('imperial')}
        >
          Imperial
        </button>
      </div>

      {unit === 'metric' ? (
        <div>
          <div>
            <label htmlFor="weight-kg">Weight (kg)</label>
            <input
              id="weight-kg"
              aria-label="Weight (kg)"
              type="number"
              value={weightKg}
              onChange={e => setWeightKg(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="height-cm">Height (cm)</label>
            <input
              id="height-cm"
              aria-label="Height (cm)"
              type="number"
              value={heightCm}
              onChange={e => setHeightCm(e.target.value)}
              min="0"
            />
          </div>
        </div>
      ) : (
        <div>
          <div>
            <label htmlFor="weight-lbs">Weight (lbs)</label>
            <input
              id="weight-lbs"
              aria-label="Weight (lbs)"
              type="number"
              value={weightLbs}
              onChange={e => setWeightLbs(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="height-ft">Height (ft)</label>
            <input
              id="height-ft"
              aria-label="Height (ft)"
              type="number"
              value={heightFt}
              onChange={e => setHeightFt(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="height-in">Height (in)</label>
            <input
              id="height-in"
              aria-label="Height (in)"
              type="number"
              value={heightIn}
              onChange={e => setHeightIn(e.target.value)}
              min="0"
              max="11"
            />
          </div>
        </div>
      )}

      <div>
        <span>BMI:</span>
        <span data-testid="bmi-value">{bmiDisplay}</span>
      </div>
      <div>
        <span>Category:</span>
        <span data-testid="bmi-category">{categoryDisplay}</span>
      </div>

      <button onClick={reset}>Reset</button>
    </div>
  )
}
