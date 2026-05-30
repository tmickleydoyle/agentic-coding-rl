'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function SubscribersPage() {
  const { subscribers, addSubscriber, toggleSubscriber } = useApp()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim().length === 0) {
      setError('Email is required')
      return
    }
    setError('')
    addSubscriber(email.trim())
    setEmail('')
  }

  return (
    <section data-testid="page-subscribers">
      <h1>Subscribers</h1>
      <form data-testid="subscriber-form" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          data-testid="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-subscriber">
          Add subscriber
        </button>
      </form>
      <ul data-testid="subscriber-list">
        {subscribers.map((s) => (
          <li key={s.id} data-testid={`subscriber-${s.id}`} data-active={s.active ? 'true' : 'false'}>
            <span data-testid={`subscriber-${s.id}-email`}>{s.email}</span>
            <button data-testid={`toggle-${s.id}`} onClick={() => toggleSubscriber(s.id)}>
              {s.active ? 'Unsubscribe' : 'Resubscribe'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
