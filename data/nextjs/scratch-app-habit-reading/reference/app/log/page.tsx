'use client'
import { useState } from 'react'
import { useReading } from '../../components/ReadingProvider'
import { useReadingStats } from '../../hooks/useReadingStats'
import LogRow from '../../components/LogRow'

export default function LogPage() {
  const { today, logPages, removeLog, navigate } = useReading()
  const { sorted } = useReadingStats()
  const [pages, setPages] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(pages)
    if (pages.trim().length === 0 || Number.isNaN(n) || n < 0) {
      setError('Enter a valid page count')
      return
    }
    setError('')
    logPages({ date: today, pages: n })
    setPages('')
    navigate('today')
  }

  return (
    <section data-testid="page-log">
      <h1>Log Pages</h1>
      <form data-testid="log-form" onSubmit={onSubmit}>
        <input
          data-testid="pages-input"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-pages">
          Log pages
        </button>
      </form>
      {sorted.length === 0 ? (
        <p data-testid="empty-state">No logs yet.</p>
      ) : (
        <ul data-testid="log-list">
          {sorted.map((l) => (
            <LogRow key={l.id} log={l} onRemove={removeLog} />
          ))}
        </ul>
      )}
    </section>
  )
}
