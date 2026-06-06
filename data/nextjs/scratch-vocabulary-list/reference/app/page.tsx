'use client'
import { useState } from 'react'

interface WordEntry {
  id: number
  word: string
  definition: string
  mastered: boolean
}

const SEED: WordEntry[] = [
  { id: 1, word: 'Ephemeral', definition: 'Lasting for a very short time.', mastered: false },
  { id: 2, word: 'Luminous', definition: 'Full of or shedding light; bright.', mastered: true },
  { id: 3, word: 'Tenacious', definition: 'Holding firm to a purpose; persistent.', mastered: false },
  { id: 4, word: 'Quixotic', definition: 'Exceedingly idealistic; unrealistic.', mastered: false },
]

type FilterMode = 'all' | 'mastered' | 'unmastered'

export default function App() {
  const [words, setWords] = useState<WordEntry[]>(SEED.map(w => ({ ...w })))
  const [wordInput, setWordInput] = useState('')
  const [defInput, setDefInput] = useState('')
  const [nextId, setNextId] = useState(5)
  const [filter, setFilter] = useState<FilterMode>('all')

  function addWord() {
    if (!wordInput.trim() || !defInput.trim()) return
    setWords(ws => [...ws, { id: nextId, word: wordInput.trim(), definition: defInput.trim(), mastered: false }])
    setNextId(n => n + 1)
    setWordInput('')
    setDefInput('')
  }

  function toggleMastered(id: number) {
    setWords(ws => ws.map(w => w.id === id ? { ...w, mastered: !w.mastered } : w))
  }

  function removeWord(id: number) {
    setWords(ws => ws.filter(w => w.id !== id))
  }

  const displayed = words.filter(w => {
    if (filter === 'mastered') return w.mastered
    if (filter === 'unmastered') return !w.mastered
    return true
  })

  const masteredCount = words.filter(w => w.mastered).length

  return (
    <div>
      <h1>Vocabulary List</h1>

      <div>
        <input
          aria-label="Word"
          value={wordInput}
          onChange={e => setWordInput(e.target.value)}
        />
        <textarea
          aria-label="Definition"
          value={defInput}
          onChange={e => setDefInput(e.target.value)}
        />
        <button onClick={addWord}>Add Word</button>
      </div>

      <div>
        <button onClick={() => setFilter('all')}>Show All</button>
        <button onClick={() => setFilter('mastered')}>Show Mastered</button>
        <button onClick={() => setFilter('unmastered')}>Show Unmastered</button>
      </div>

      <ul>
        {displayed.map(w => (
          <li key={w.id} data-testid="word-item">
            <span data-testid="word-term">{w.word}</span>
            <span data-testid="word-definition">{w.definition}</span>
            <span data-testid="word-status">{w.mastered ? 'Mastered' : 'Learning'}</span>
            <button onClick={() => toggleMastered(w.id)}>
              {w.mastered ? 'Mark Learning' : 'Mark Mastered'}
            </button>
            <button onClick={() => removeWord(w.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <p data-testid="word-count">Words: {words.length}</p>
      <p data-testid="mastered-count">Mastered: {masteredCount}</p>
    </div>
  )
}
