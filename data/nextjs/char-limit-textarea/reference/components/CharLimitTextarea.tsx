'use client'
import { useState } from 'react'

const MAX = 140
const WARN = 120

export default function CharLimitTextarea() {
  const [text, setText] = useState('')
  const count = text.length
  const isWarning = count >= WARN

  return (
    <div>
      <textarea
        data-testid="char-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={MAX}
        rows={4}
        style={{ width: '100%' }}
      />
      <span
        data-testid="char-count"
        style={{ color: isWarning ? 'red' : 'inherit' }}
      >
        {count} / {MAX}
      </span>
      {isWarning && (
        <span data-testid="char-warning">Approaching limit</span>
      )}
    </div>
  )
}
