'use client'
import { useState } from 'react'

export default function App() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')

  return (
    <div>
      <h1>Diff Viewer</h1>
      <div>
        <label htmlFor="original-text">Original Text</label>
        <textarea
          id="original-text"
          aria-label="Original Text"
          placeholder="Enter original text..."
          value={original}
          onChange={e => setOriginal(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="modified-text">Modified Text</label>
        <textarea
          id="modified-text"
          aria-label="Modified Text"
          placeholder="Enter modified text..."
          value={modified}
          onChange={e => setModified(e.target.value)}
        />
      </div>
      <button>Compare</button>
      <div>
        {/* diff output goes here */}
      </div>
    </div>
  )
}
