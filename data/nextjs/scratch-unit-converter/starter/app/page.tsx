'use client'
import { useState } from 'react'

export default function App() {
  const [value, setValue] = useState('')

  return (
    <div>
      <h1>Unit Converter</h1>
      <div>
        <input
          aria-label="Value"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <p data-testid="result"></p>
      <ul></ul>
    </div>
  )
}
