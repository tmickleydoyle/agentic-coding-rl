'use client'
import { useState } from 'react'

export default function TagInput() {
  const [tags, setTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = inputValue.trim()
      if (trimmed && !tags.includes(trimmed)) {
        setTags(prev => [...prev, trimmed])
      }
      setInputValue('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  return (
    <div>
      <input
        data-testid="tag-input"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter"
      />
      <div data-testid="tag-list">
        {tags.map(tag => (
          <span key={tag} data-testid={`tag-${tag}`}>
            {tag}
            <button
              data-testid={`remove-${tag}`}
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
