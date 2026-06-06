'use client'
import { useState } from 'react'

function countWords(text: string): number {
  const trimmed = text.trim()
  if (trimmed === '') return 0
  return trimmed.split(/\s+/).length
}

export default function WordCounter() {
  const [text, setText] = useState('')

  return (
    <div>
      <textarea
        data-testid="textarea"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <span data-testid="word-count">{countWords(text)}</span>
      <button data-testid="clear-btn" onClick={() => setText('')}>Clear</button>
    </div>
  )
}
