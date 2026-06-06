'use client'
import { useState } from 'react'

interface JournalEntry {
  id: number
  date: string
  mood: string
  text: string
  tags: string[]
}

const MOODS = ['happy', 'neutral', 'sad', 'excited', 'anxious']

const SEED: JournalEntry[] = [
  { id: 1, date: '2024-01-15', mood: 'happy', text: 'Had a great day. Finished the project ahead of schedule.', tags: ['work', 'productivity'] },
  { id: 2, date: '2024-01-14', mood: 'neutral', text: 'Ordinary day. Took a walk in the afternoon.', tags: ['health'] },
]

function computeMoodSummary(entries: JournalEntry[]): string {
  if (entries.length === 0) return 'none'
  const counts: Record<string, number> = {}
  entries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1 })
  let best = MOODS[0]
  let bestCount = counts[MOODS[0]] || 0
  for (let i = 1; i < MOODS.length; i++) {
    const c = counts[MOODS[i]] || 0
    if (c > bestCount) {
      bestCount = c
      best = MOODS[i]
    }
  }
  return best
}

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>(SEED.map(e => ({ ...e, tags: [...e.tags] })))
  const [search, setSearch] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [moodInput, setMoodInput] = useState('happy')
  const [textInput, setTextInput] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  function addEntry() {
    if (!textInput.trim()) return
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    setEntries(es => [
      ...es,
      { id: Date.now(), date: dateInput, mood: moodInput, text: textInput.trim(), tags },
    ])
    setDateInput('')
    setMoodInput('happy')
    setTextInput('')
    setTagsInput('')
  }

  function deleteEntry(id: number) {
    setEntries(es => es.filter(e => e.id !== id))
  }

  const filtered = search
    ? entries.filter(e => e.text.toLowerCase().includes(search.toLowerCase()))
    : entries

  const moodSummary = computeMoodSummary(filtered)

  return (
    <div>
      <h1>Reflection Journal</h1>
      <p data-testid="entry-count">Entries: {filtered.length}</p>
      <p data-testid="mood-summary">Most common mood: {moodSummary}</p>
      <input
        aria-label="Search entries"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul>
        {filtered.map(entry => (
          <li key={entry.id} data-testid="journal-entry">
            <span data-testid="entry-date">{entry.date}</span>
            <span data-testid="entry-mood">{entry.mood}</span>
            <span data-testid="entry-text">{entry.text}</span>
            <span data-testid="entry-tags">{entry.tags.join(', ')}</span>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="date"
          aria-label="Date"
          value={dateInput}
          onChange={e => setDateInput(e.target.value)}
        />
        <select
          aria-label="Mood"
          value={moodInput}
          onChange={e => setMoodInput(e.target.value)}
        >
          {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <textarea
          aria-label="Journal text"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
        />
        <input
          aria-label="Tags"
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
        />
        <button onClick={addEntry}>Add Entry</button>
      </div>
    </div>
  )
}
