'use client'
import { useState } from 'react'

const MAX = 140

export default function CharLimitTextarea() {
  const [text, setText] = useState('')

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
      <span data-testid="char-count">0 / 140</span>
    </div>
  )
}
