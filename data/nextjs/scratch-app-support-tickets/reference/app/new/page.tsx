'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { Priority } from '../../lib/types'

export default function NewTicketPage() {
  const { addTicket, navigate } = useApp()
  const [subject, setSubject] = useState('')
  const [requester, setRequester] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subject.trim().length === 0) {
      setError('Subject is required')
      return
    }
    setError('')
    addTicket({
      subject: subject.trim(),
      requester: requester.trim().length > 0 ? requester.trim() : 'anonymous',
      priority,
    })
    setSubject('')
    setRequester('')
    navigate('tickets')
  }

  return (
    <section data-testid="page-new">
      <h1>New ticket</h1>
      <form data-testid="new-ticket-form" onSubmit={onSubmit}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          data-testid="subject-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <label htmlFor="requester">Requester</label>
        <input
          id="requester"
          data-testid="requester-input"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          data-testid="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
          <option value="urgent">urgent</option>
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-ticket">
          Create ticket
        </button>
      </form>
    </section>
  )
}
