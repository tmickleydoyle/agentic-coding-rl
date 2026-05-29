'use client'
import { useState } from 'react'

export default function UppercaseInput() {
  const [v, setV] = useState('')
  return (
    <div>
      <input data-testid="input" value={v} onChange={(e) => setV(e.target.value)} />
      <span data-testid="echo">{v.toUpperCase()}</span>
    </div>
  )
}
