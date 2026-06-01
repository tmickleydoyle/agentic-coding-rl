'use client'
import { useApp } from '../../components/AppStateProvider'
import { doneFollowUps } from '../../hooks/useFollowUps'
import FollowUpItem from '../../components/FollowUpItem'

export default function DonePage() {
  const { contacts, followups, toggleFollowUp, removeFollowUp } = useApp()
  const contactName = (id: string): string =>
    contacts.find((c) => c.id === id)?.name ?? 'Unknown'
  const done = doneFollowUps(followups)

  return (
    <section data-testid="page-done">
      <h1>Done</h1>
      <span data-testid="done-count">{done.length}</span>
      {done.length === 0 ? (
        <p data-testid="done-empty">No completed tasks.</p>
      ) : (
        <ul data-testid="done-list">
          {done.map((f) => (
            <FollowUpItem
              key={f.id}
              followup={f}
              contactName={contactName(f.contactId)}
              onToggle={toggleFollowUp}
              onRemove={removeFollowUp}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
