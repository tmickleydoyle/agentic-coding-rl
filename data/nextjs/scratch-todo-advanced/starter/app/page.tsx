'use client'
import { useState } from 'react'

export default function App() {
  const [text, setText] = useState('')

  return (
    <div>
      <h1>Advanced Todo</h1>
      <input aria-label="Task" value={text} onChange={e => setText(e.target.value)} />
      <select aria-label="Priority"><option value="medium">medium</option></select>
      <button>Add</button>
      <select aria-label="Status Filter"><option value="all">all</option></select>
      <select aria-label="Priority Filter"><option value="all">all</option></select>
      <ul></ul>
      <div>
        <span data-testid="total-count">0</span>
        <span data-testid="active-count">0</span>
        <span data-testid="done-count">0</span>
      </div>
    </div>
  )
}
