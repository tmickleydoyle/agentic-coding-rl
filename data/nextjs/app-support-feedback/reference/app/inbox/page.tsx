'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useFeedback } from '../../hooks/useFeedback'
import FeedbackItem from '../../components/FeedbackItem'
import type { Sentiment } from '../../lib/types'

export default function InboxPage() {
  const { categoryFilter, setCategoryFilter, selectItem, addFeedback } = useApp()
  const { filtered, cats } = useFeedback()
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('')
  const [sentiment, setSentiment] = useState<Sentiment>('neutral')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (author.trim().length === 0 || message.trim().length === 0) {
      setError('Author and message are required')
      return
    }
    setError('')
    addFeedback({
      author: author.trim(),
      message: message.trim(),
      category: category.trim().length > 0 ? category.trim() : 'General',
      sentiment,
    })
    setAuthor('')
    setMessage('')
    setCategory('')
    setSentiment('neutral')
  }

  return (
    <section data-testid="page-inbox">
      <h1>Inbox</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <input data-testid="author-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input data-testid="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
        <input data-testid="new-category-input" value={category} onChange={(e) => setCategory(e.target.value)} />
        <select data-testid="sentiment-select" value={sentiment} onChange={(e) => setSentiment(e.target.value as Sentiment)}>
          <option value="positive">positive</option>
          <option value="neutral">neutral</option>
          <option value="negative">negative</option>
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-feedback">
          Add
        </button>
      </form>
      <select
        data-testid="category-filter"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All categories</option>
        {cats.map((c) => (
          <option key={c.category} value={c.category}>
            {c.category}
          </option>
        ))}
      </select>
      <p data-testid="inbox-count">{filtered.length}</p>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No feedback matches.</p>
      ) : (
        <ul data-testid="feedback-list">
          {filtered.map((f) => (
            <FeedbackItem key={f.id} item={f} onOpen={selectItem} />
          ))}
        </ul>
      )}
    </section>
  )
}
