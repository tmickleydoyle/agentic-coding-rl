'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function ComposePage() {
  const { addCampaign, navigate } = useApp()
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subject.trim().length === 0) {
      setError('Subject is required')
      return
    }
    setError('')
    addCampaign({ subject: subject.trim(), body: body.trim() })
    setSubject('')
    setBody('')
    navigate('campaigns')
  }

  return (
    <section data-testid="page-compose">
      <h1>Compose</h1>
      <form data-testid="compose-form" onSubmit={onSubmit}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          data-testid="subject-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          data-testid="body-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-campaign">
          Save campaign
        </button>
      </form>
    </section>
  )
}
