'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { ActivityKind } from '../../lib/types'

const KINDS: ActivityKind[] = ['call', 'email', 'note']

export default function ActivityPage() {
  const { contacts, activities, logActivity } = useApp()
  const [contactId, setContactId] = useState(contacts[0]?.id ?? '')
  const [kind, setKind] = useState<ActivityKind>('call')
  const [text, setText] = useState('')
  const [error, setError] = useState(false)

  const contactName = (id: string): string =>
    contacts.find((c) => c.id === id)?.name ?? 'Unknown'

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) {
      setError(true)
      return
    }
    logActivity({ contactId, kind, text: text.trim() })
    setText('')
    setError(false)
  }

  return (
    <section data-testid="page-activity">
      <h1>Activity</h1>
      <form data-testid="activity-form" onSubmit={onSubmit}>
        <select
          data-testid="activity-contact"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        >
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          data-testid="activity-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as ActivityKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <input data-testid="activity-text" value={text} onChange={(e) => setText(e.target.value)} />
        <button data-testid="activity-submit" type="submit">
          Log
        </button>
      </form>
      {error && <p data-testid="activity-error">Text required</p>}
      <span data-testid="activity-total">{activities.length}</span>
      <ul data-testid="activity-feed">
        {activities.map((a) => (
          <li key={a.id} data-testid={`feed-${a.id}`} data-kind={a.kind}>
            <span data-testid={`feed-${a.id}-contact`}>{contactName(a.contactId)}</span>
            <span data-testid={`feed-${a.id}-text`}>{a.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
