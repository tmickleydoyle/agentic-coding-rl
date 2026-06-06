'use client'
import { useState } from 'react'

interface Translation {
  id: number
  source: string
  target: string
  pair: string
}

const SEED: Translation[] = [
  { id: 1, source: 'Good morning', target: 'Buenos días', pair: 'EN→ES' },
  { id: 2, source: 'How are you?', target: 'Comment allez-vous?', pair: 'EN→FR' },
  { id: 3, source: 'Good night', target: 'Buona notte', pair: 'EN→IT' },
  { id: 4, source: 'Thank you very much', target: 'Muchas gracias', pair: 'EN→ES' },
]

export default function App() {
  const [translations, setTranslations] = useState<Translation[]>(SEED.map(t => ({ ...t })))
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [pair, setPair] = useState('EN→ES')
  const [nextId, setNextId] = useState(5)
  const [error, setError] = useState(false)

  const visible = translations.filter(t => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.source.toLowerCase().includes(q) || t.target.toLowerCase().includes(q)
  })

  function handleSave() {
    if (!source.trim() || !target.trim()) {
      setError(true)
      return
    }
    setTranslations(prev => [...prev, { id: nextId, source: source.trim(), target: target.trim(), pair }])
    setNextId(n => n + 1)
    setSource('')
    setTarget('')
    setError(false)
  }

  function handleDelete(id: number) {
    setTranslations(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>
      <h1>Translation Pad</h1>

      <div data-testid="total-count">{visible.length} translations</div>

      <input
        data-testid="search-input"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div>
        <input
          data-testid="source-input"
          placeholder="Source text"
          value={source}
          onChange={e => setSource(e.target.value)}
        />
        <input
          data-testid="target-input"
          placeholder="Translation"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <select
          data-testid="pair-select"
          value={pair}
          onChange={e => setPair(e.target.value)}
        >
          <option value="EN→ES">EN→ES</option>
          <option value="EN→FR">EN→FR</option>
          <option value="EN→IT">EN→IT</option>
          <option value="EN→DE">EN→DE</option>
        </select>
        <button data-testid="save-btn" onClick={handleSave}>Save</button>
        {error && (
          <div data-testid="error-msg">Source and translation are required.</div>
        )}
      </div>

      <div>
        {visible.map(t => (
          <div key={t.id} data-testid={`translation-${t.id}`}>
            <span data-testid={`source-${t.id}`}>{t.source}</span>
            <span data-testid={`target-${t.id}`}>{t.target}</span>
            <span data-testid={`pair-${t.id}`}>{t.pair}</span>
            <button data-testid={`delete-${t.id}`} onClick={() => handleDelete(t.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
