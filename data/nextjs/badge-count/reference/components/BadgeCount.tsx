'use client'
import { useState } from 'react'

export default function BadgeCount() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {count > 0 && (
        <span data-testid="badge">{count}</span>
      )}
      <button data-testid="add-btn" onClick={() => setCount(c => c + 1)}>Add</button>
      <button data-testid="clear-btn" onClick={() => setCount(0)}>Clear</button>
    </div>
  )
}
