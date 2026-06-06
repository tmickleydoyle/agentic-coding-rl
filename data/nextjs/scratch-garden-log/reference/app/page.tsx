'use client'
import { useState } from 'react'

interface Entry {
  id: number
  date: string
  activity: string
  description: string
  tags: string[]
}

const SEED_ENTRIES: Entry[] = [
  { id: 1, date: '2024-01-15', activity: 'planting', description: 'Planted tomato seedlings in raised bed 1', tags: ['tomatoes', 'seedlings'] },
  { id: 2, date: '2024-01-12', activity: 'weeding', description: 'Cleared weeds from the herb garden', tags: ['herbs', 'maintenance'] },
  { id: 3, date: '2024-01-10', activity: 'watering', description: 'Deep watered all beds after dry spell', tags: ['watering'] },
  { id: 4, date: '2024-01-08', activity: 'harvesting', description: 'Harvested kale and spinach', tags: ['kale', 'spinach'] },
]

const ACTIVITIES = ['planting', 'weeding', 'watering', 'harvesting', 'fertilizing', 'pruning']

let nextId = 5

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES.map(e => ({ ...e, tags: [...e.tags] })))
  const [date, setDate] = useState('')
  const [activity, setActivity] = useState('planting')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [filterActivity, setFilterActivity] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = entries
    .filter(e => filterActivity === 'All' || e.activity === filterActivity)
    .filter(e => search === '' || e.description.toLowerCase().includes(search.toLowerCase()))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !description.trim()) return
    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    const newEntry: Entry = {
      id: nextId++,
      date,
      activity,
      description: description.trim(),
      tags: parsedTags,
    }
    setEntries(prev => [...prev, newEntry])
    setDate('')
    setActivity('planting')
    setDescription('')
    setTags('')
  }

  function handleDelete(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h1>Garden Log</h1>

      <form data-testid="add-entry-form" onSubmit={handleSubmit}>
        <h2>Add Entry</h2>
        <input
          type="date"
          data-testid="entry-date-input"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          data-testid="activity-select"
          value={activity}
          onChange={e => setActivity(e.target.value)}
        >
          {ACTIVITIES.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <textarea
          data-testid="description-input"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          data-testid="tags-input"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
        />
        <button type="submit" data-testid="add-entry-btn">Add Entry</button>
      </form>

      <div data-testid="filter-bar">
        <select
          data-testid="filter-activity"
          value={filterActivity}
          onChange={e => setFilterActivity(e.target.value)}
        >
          <option value="All">All</option>
          {ACTIVITIES.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <input
          type="text"
          data-testid="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search descriptions..."
        />
      </div>

      <p data-testid="entry-count">Showing {filtered.length} of {entries.length} entries</p>

      <div data-testid="entries-list">
        {filtered.length === 0 ? (
          <p data-testid="no-entries-msg">No entries found</p>
        ) : (
          filtered.map(entry => (
            <div key={entry.id} data-testid={`entry-row-${entry.id}`}>
              <span>{entry.date}</span>
              <span>{entry.activity}</span>
              <span>{entry.description}</span>
              <span>
                {entry.tags.map(tag => (
                  <span key={tag} data-testid="tag-chip">{tag}</span>
                ))}
              </span>
              <button
                data-testid={`delete-entry-${entry.id}`}
                onClick={() => handleDelete(entry.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
