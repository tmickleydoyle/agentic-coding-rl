'use client'
import { useState } from 'react'

export default function TagInput() {
  const [tags] = useState<string[]>([])
  const [inputValue] = useState('')

  return (
    <div>
      <input
        data-testid="tag-input"
        value={inputValue}
        onChange={() => {}}
        placeholder="Add a tag and press Enter"
      />
      <div data-testid="tag-list">
        {tags.map(tag => (
          <span key={tag} data-testid={`tag-${tag}`}>
            {tag}
            <button data-testid={`remove-${tag}`}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}
