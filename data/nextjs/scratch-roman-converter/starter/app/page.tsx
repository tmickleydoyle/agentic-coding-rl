'use client'
import { useState } from 'react'

export default function App() {
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman')
  const [input, setInput] = useState('')

  return (
    <div>
      <h1>Roman Numeral Converter</h1>
      <div>
        <label>
          <input type="radio" name="mode" checked={mode === 'toRoman'} onChange={() => setMode('toRoman')} />
          Integer → Roman
        </label>
        <label>
          <input type="radio" name="mode" checked={mode === 'fromRoman'} onChange={() => setMode('fromRoman')} />
          Roman → Integer
        </label>
      </div>
      {mode === 'toRoman' ? (
        <div>
          <label htmlFor="integer-input">Integer</label>
          <input id="integer-input" type="text" value={input} onChange={e => setInput(e.target.value)} />
        </div>
      ) : (
        <div>
          <label htmlFor="roman-input">Roman Numeral</label>
          <input id="roman-input" type="text" value={input} onChange={e => setInput(e.target.value)} />
        </div>
      )}
      <button onClick={() => {}}>Convert</button>
      <p>Result: <span data-testid="conversion-result">—</span></p>
      <button onClick={() => {}}>Clear History</button>
      <ul></ul>
    </div>
  )
}
