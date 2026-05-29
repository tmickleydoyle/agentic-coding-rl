'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button data-testid="dec" onClick={() => setCount((c) => Math.max(0, c - 1))}>
        -
      </button>
      <span data-testid="value">{count}</span>
      <button data-testid="inc" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
    </div>
  )
}
