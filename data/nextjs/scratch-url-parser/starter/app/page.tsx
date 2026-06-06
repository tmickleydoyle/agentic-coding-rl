'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')

  return (
    <div>
      <h1>URL Parser</h1>
      <input aria-label="URL" value={input} onChange={e => setInput(e.target.value)} />
      <button>Parse</button>
      <button>Clear</button>
      <div>{/* results go here */}</div>
    </div>
  )
}
