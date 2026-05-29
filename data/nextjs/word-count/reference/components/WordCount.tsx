'use client'
import { useState } from 'react'

export default function WordCount() {
  const [v, setV] = useState('')
  const words = v.trim() === '' ? 0 : v.trim().split(/\s+/).length
  return (
    <div>
      <textarea data-testid="text" value={v} onChange={(e) => setV(e.target.value)} />
      <span data-testid="count">{words}</span>
    </div>
  )
}
