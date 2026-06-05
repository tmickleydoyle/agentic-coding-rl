'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { Mood } from '../../lib/types'
import { TODAY } from '../../lib/types'

export default function NewEntryPage() {
  const { addEntry, navigate } = useApp()
  const [date, setDate] = useState(TODAY)
  const [body, setBody] = useState('')
  const [mood, setMood] = useState<Mood>('happy')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (body.trim().length === 0) {
      setError('Body is required')
      return
    }
    setError('')
    addEntry({ date, body: body.trim(), mood })
    navigate('entries')
  }

  return (
    <section data-testid="page-new">
      <h1>New entry</h1>
      <form data-testid="entry-form" onSubmit={onSubmit}>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          data-testid="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          data-testid="body-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label htmlFor="mood">Mood</label>
        <select
          id="mood"
          data-testid="mood-select"
          value={mood}
          onChange={(e) => setMood(e.target.value as Mood)}
        >
          <option value="happy">happy</option>
          <option value="neutral">neutral</option>
          <option value="sad">sad</option>
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="save-entry">
          Save entry
        </button>
      </form>
    </section>
  )
}
