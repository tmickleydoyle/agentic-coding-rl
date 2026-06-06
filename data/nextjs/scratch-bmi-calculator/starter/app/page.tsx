'use client'
import { useState } from 'react'

export default function App() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')

  return (
    <div>
      <h1>BMI Calculator</h1>
      <div data-testid="bmi-value">--</div>
      <div data-testid="bmi-category">--</div>
    </div>
  )
}
