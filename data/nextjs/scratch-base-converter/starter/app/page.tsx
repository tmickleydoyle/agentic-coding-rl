'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState('10')

  return (
    <div>
      <h1>Base Converter</h1>
      <label htmlFor="input-value">Input Value</label>
      <input
        id="input-value"
        aria-label="Input Value"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <label htmlFor="from-base">From Base</label>
      <select
        id="from-base"
        aria-label="From Base"
        value={fromBase}
        onChange={e => setFromBase(e.target.value)}
      >
        <option value="2">Binary (2)</option>
        <option value="8">Octal (8)</option>
        <option value="10">Decimal (10)</option>
        <option value="16">Hexadecimal (16)</option>
      </select>
      <button>Convert</button>
      <div>
        {/* results go here */}
      </div>
    </div>
  )
}
