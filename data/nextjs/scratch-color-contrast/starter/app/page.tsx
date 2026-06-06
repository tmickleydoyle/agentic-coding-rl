'use client'
import { useState } from 'react'

export default function App() {
  const [fg, setFg] = useState('')
  const [bg, setBg] = useState('')

  return (
    <div>
      <h1>Color Contrast Checker</h1>
      <input aria-label="Foreground Color" value={fg} onChange={e => setFg(e.target.value)} />
      <input aria-label="Background Color" value={bg} onChange={e => setBg(e.target.value)} />
      <button>Check</button>
      <button>Reset</button>
      <div data-testid="preview-box">Sample Text</div>
    </div>
  )
}
