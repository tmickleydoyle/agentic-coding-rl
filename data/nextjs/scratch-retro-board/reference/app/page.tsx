'use client'
import { useState } from 'react'

type Category = 'Went Well' | 'Needs Improvement' | 'Action Items'

interface Note {
  id: number
  category: Category
  text: string
  votes: number
}

const CATEGORIES: Category[] = ['Went Well', 'Needs Improvement', 'Action Items']

const SEED: Note[] = [
  { id: 1, category: 'Went Well', text: 'Great team communication', votes: 0 },
  { id: 2, category: 'Went Well', text: 'Delivered all features on time', votes: 0 },
  { id: 3, category: 'Needs Improvement', text: 'Too many interruptions during focus', votes: 0 },
  { id: 4, category: 'Needs Improvement', text: 'Code review process was slow', votes: 0 },
  { id: 5, category: 'Action Items', text: 'Schedule daily standups', votes: 0 },
  { id: 6, category: 'Action Items', text: 'Set up automated testing pipeline', votes: 0 },
]

function colTestId(cat: Category): string {
  if (cat === 'Went Well') return 'col-went-well'
  if (cat === 'Needs Improvement') return 'col-needs-improvement'
  return 'col-action-items'
}

function countTestId(cat: Category): string {
  if (cat === 'Went Well') return 'count-went-well'
  if (cat === 'Needs Improvement') return 'count-needs-improvement'
  return 'count-action-items'
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED.map(n => ({ ...n })))
  const [noteText, setNoteText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('Went Well')
  const [nextId, setNextId] = useState(SEED.length + 1)

  function addNote() {
    if (!noteText.trim()) return
    setNotes(prev => [
      ...prev,
      { id: nextId, category: selectedCategory, text: noteText.trim(), votes: 0 },
    ])
    setNextId(n => n + 1)
    setNoteText('')
  }

  function deleteNote(id: number) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  function upvote(id: number) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, votes: n.votes + 1 } : n))
  }

  return (
    <div>
      <h1>Retro Board</h1>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {CATEGORIES.map(cat => {
          const catNotes = notes.filter(n => n.category === cat)
          return (
            <div key={cat} data-testid={colTestId(cat)}>
              <h2>
                {cat} <span data-testid={countTestId(cat)}>{catNotes.length}</span>
              </h2>
              <ul>
                {catNotes.map(note => (
                  <li key={note.id} data-testid="note-card">
                    <p>{note.text}</p>
                    <span data-testid="note-votes">{note.votes}</span>
                    <button onClick={() => upvote(note.id)}>Upvote</button>
                    <button onClick={() => deleteNote(note.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div>
        <h2>Add Note</h2>
        <label>
          Note Text
          <textarea
            aria-label="Note Text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            aria-label="Category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as Category)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <button onClick={addNote}>Add Note</button>
      </div>
    </div>
  )
}
