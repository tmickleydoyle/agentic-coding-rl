'use client'
import { useState } from 'react'

export default function ClearableInput() {
  const [v, setV] = useState('')
  return (
    <div>
      <input data-testid="input" value={v} onChange={(e) => setV(e.target.value)} />
      <button data-testid="clear" disabled={v === ''} onClick={() => setV('')}>
        Clear
      </button>
    </div>
  )
}
