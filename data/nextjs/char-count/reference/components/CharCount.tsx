'use client'
import { useState } from 'react'

export default function CharCount() {
  const [value, setValue] = useState('')
  return (
    <div>
      <input
        data-testid="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span data-testid="count">{value.length}</span>
      {value.length > 100 && <p data-testid="warning">Too long</p>}
    </div>
  )
}
