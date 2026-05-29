'use client'
import { useState } from 'react'

export default function Greeting() {
  const [name, setName] = useState('')
  const display = name.trim() === '' ? 'stranger' : name
  return (
    <div>
      <label>
        Your name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <p data-testid="greeting">Hello, {display}!</p>
    </div>
  )
}
