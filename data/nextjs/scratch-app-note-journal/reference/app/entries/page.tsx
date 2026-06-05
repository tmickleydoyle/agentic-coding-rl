'use client'
import { useApp } from '../../components/AppStateProvider'
import { useJournal } from '../../hooks/useJournal'
import type { Mood } from '../../lib/types'

const NEXT_MOOD: Record<Mood, Mood> = {
  happy: 'neutral',
  neutral: 'sad',
  sad: 'happy',
}

const MOODS: (Mood | 'all')[] = ['all', 'happy', 'neutral', 'sad']

export default function EntriesPage() {
  const { moodFilter, setMoodFilter, updateEntry, removeEntry } = useApp()
  const { filteredEntries } = useJournal()

  return (
    <section data-testid="page-entries">
      <h1>Entries</h1>
      <select
        data-testid="mood-filter"
        value={moodFilter}
        onChange={(e) => setMoodFilter(e.target.value as Mood | 'all')}
      >
        {MOODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      {filteredEntries.length === 0 ? (
        <p data-testid="entries-empty">No entries match.</p>
      ) : (
        <ul data-testid="entry-list">
          {filteredEntries.map((e) => (
            <li key={e.id} data-testid={`entry-${e.id}`} data-mood={e.mood}>
              <span data-testid={`entry-${e.id}-date`}>{e.date}</span>
              <span data-testid={`entry-${e.id}-body`}>{e.body}</span>
              <button
                data-testid={`mood-${e.id}`}
                onClick={() => updateEntry(e.id, { mood: NEXT_MOOD[e.mood] })}
              >
                {e.mood}
              </button>
              <button data-testid={`delete-${e.id}`} onClick={() => removeEntry(e.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
