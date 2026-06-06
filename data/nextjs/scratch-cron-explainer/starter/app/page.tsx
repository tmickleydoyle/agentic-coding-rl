'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')

  return (
    <div>
      <h1>Cron Explainer</h1>
      <input aria-label="Cron Expression" value={input} onChange={e => setInput(e.target.value)} />
      <button>Explain</button>
      <button>Reset</button>
      <div>{/* results go here */}</div>
    </div>
  )
}
