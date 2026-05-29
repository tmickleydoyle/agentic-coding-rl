'use client'
import { useState } from 'react'

export default function ToggleBlock({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <button onClick={() => setVisible((v) => !v)}>{visible ? 'Hide' : 'Show'}</button>
      {visible && <p data-testid="block">{text}</p>}
    </div>
  )
}
