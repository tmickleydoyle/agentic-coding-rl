'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { byDueDate, openFollowUps } from '../../hooks/useFollowUps'
import FollowUpItem from '../../components/FollowUpItem'
import { TODAY } from '../../lib/types'

export default function TasksPage() {
  const { contacts, followups, addFollowUp, toggleFollowUp, removeFollowUp } = useApp()
  const [title, setTitle] = useState('')
  const [contactId, setContactId] = useState(contacts[0]?.id ?? '')
  const [dueDate, setDueDate] = useState(TODAY)
  const [error, setError] = useState(false)

  const contactName = (id: string): string =>
    contacts.find((c) => c.id === id)?.name ?? 'Unknown'

  const open = byDueDate(openFollowUps(followups))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError(true)
      return
    }
    addFollowUp({ title: title.trim(), contactId, dueDate })
    setTitle('')
    setError(false)
  }

  return (
    <section data-testid="page-tasks">
      <h1>Tasks</h1>
      <form data-testid="new-task-form" onSubmit={onSubmit}>
        <input data-testid="title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select
          data-testid="contact-select"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        >
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          data-testid="due-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button data-testid="submit-task" type="submit">
          Add
        </button>
      </form>
      {error && <p data-testid="form-error">Title required</p>}
      <ul data-testid="task-list">
        {open.map((f) => (
          <FollowUpItem
            key={f.id}
            followup={f}
            contactName={contactName(f.contactId)}
            onToggle={toggleFollowUp}
            onRemove={removeFollowUp}
          />
        ))}
      </ul>
    </section>
  )
}
