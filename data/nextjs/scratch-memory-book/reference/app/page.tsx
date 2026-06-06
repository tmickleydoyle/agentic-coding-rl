'use client'
import { useState } from 'react'

interface Memory {
  id: number
  title: string
  date: string
  mood: string
  tags: string[]
  note: string
}

const MOODS = ['happy', 'excited', 'peaceful', 'sad', 'grateful']

const SEED: Memory[] = [
  { id: 1, title: 'First Day of School', date: '2023-09-05', mood: 'excited', tags: ['school', 'milestone'], note: 'Nervous but so ready for this new chapter' },
  { id: 2, title: 'Family Reunion', date: '2023-07-04', mood: 'happy', tags: ['family', 'summer'], note: 'BBQ and fireworks with everyone together' },
  { id: 3, title: 'Rainy Sunday', date: '2023-11-12', mood: 'peaceful', tags: ['home', 'relax'], note: 'Books and hot cocoa all afternoon' },
]

export default function App() {
  const [memories, setMemories] = useState<Memory[]>(SEED.map(m => ({ ...m, tags: [...m.tags] })))
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [mood, setMood] = useState('happy')
  const [tagsInput, setTagsInput] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [moodFilter, setMoodFilter] = useState('')
  const [nextId, setNextId] = useState(4)

  function handleAdd() {
    if (!title.trim() || !date.trim()) {
      setError('Title and date are required')
      return
    }
    setError('')
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
    setMemories(prev => [...prev, { id: nextId, title: title.trim(), date, mood, tags, note: note.trim() }])
    setNextId(n => n + 1)
    setTitle('')
    setDate('')
    setMood('happy')
    setTagsInput('')
    setNote('')
  }

  function handleDelete(id: number) {
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  const filtered = moodFilter ? memories.filter(m => m.mood === moodFilter) : memories

  return (
    <div>
      <h1>Memory Book</h1>
      <p data-testid="memory-count">{filtered.length} memories</p>

      <label>
        Filter by Mood
        <select data-testid="mood-filter" value={moodFilter} onChange={e => setMoodFilter(e.target.value)}>
          <option value="">All Moods</option>
          {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>

      {filtered.length === 0 ? (
        <p data-testid="empty-state">No memories found</p>
      ) : (
        <div>
          {filtered.map(memory => (
            <div key={memory.id} data-testid="memory-card">
              <h2>{memory.title}</h2>
              <p data-testid="memory-date">{memory.date}</p>
              <span data-testid="mood-badge">{memory.mood}</span>
              <div>
                {memory.tags.map((tag, i) => (
                  <span key={i} data-testid="tag">{tag}</span>
                ))}
              </div>
              <p data-testid="memory-note">{memory.note}</p>
              <button data-testid="delete-btn" onClick={() => handleDelete(memory.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div data-testid="add-form">
        <h2>Add Memory</h2>
        {error && <p data-testid="form-error">{error}</p>}
        <label>
          Title
          <input data-testid="input-title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Date
          <input data-testid="input-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Mood
          <select data-testid="input-mood" value={mood} onChange={e => setMood(e.target.value)}>
            {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Tags (comma-separated)
          <input data-testid="input-tags" type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
        </label>
        <label>
          Note
          <input data-testid="input-note" type="text" value={note} onChange={e => setNote(e.target.value)} />
        </label>
        <button data-testid="add-btn" onClick={handleAdd}>Add Memory</button>
      </div>
    </div>
  )
}
