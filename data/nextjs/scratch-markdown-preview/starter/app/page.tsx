'use client'
import { useState } from 'react'

export default function App() {
  const [markdown, setMarkdown] = useState('')

  return (
    <div>
      <h1>Markdown Preview</h1>
      <textarea
        aria-label="Markdown Input"
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
      />
      <div data-testid="preview-area"></div>
      <p data-testid="char-count">0 characters</p>
      <p data-testid="word-count">0 words</p>
      <button>Clear</button>
      <button>Copy Markdown</button>
    </div>
  )
}
