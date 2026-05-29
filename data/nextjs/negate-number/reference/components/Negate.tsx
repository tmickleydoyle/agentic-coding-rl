'use client'
import { useState } from 'react'

export default function Negate() {
  const [v, setV] = useState('')
  const [result, setResult] = useState(0)
  return (
    <div>
      <input
        data-testid="input"
        type="number"
        value={v}
        onChange={(e) => setV(e.target.value)}
      />
      <button data-testid="negate" onClick={() => setResult(-Number(v || 0))}>
        Negate
      </button>
      <span data-testid="result">{result}</span>
    </div>
  )
}
