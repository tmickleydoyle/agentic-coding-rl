'use client'
import { useState } from 'react'

export default function TempConverter() {
  const [celsius, setCelsius] = useState('')

  const parsed = Number(celsius)
  const valid = celsius.trim() !== '' && !Number.isNaN(parsed)
  const fahrenheit = valid ? (parsed * 9) / 5 : null

  return (
    <div>
      <input
        data-testid="celsius"
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
      <span data-testid="fahrenheit">
        {fahrenheit === null ? '' : fahrenheit.toFixed(1)}
      </span>
    </div>
  )
}
