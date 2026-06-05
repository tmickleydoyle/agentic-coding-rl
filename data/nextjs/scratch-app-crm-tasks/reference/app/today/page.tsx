'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFollowUps } from '../../hooks/useFollowUps'
import FollowUpItem from '../../components/FollowUpItem'

export default function TodayPage() {
  const { contacts, toggleFollowUp, removeFollowUp } = useApp()
  const { today, overdue } = useFollowUps()
  const contactName = (id: string): string =>
    contacts.find((c) => c.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <span data-testid="today-count">{today.length}</span>
      <span data-testid="overdue-count">{overdue.length}</span>
      {today.length === 0 ? (
        <p data-testid="today-empty">Nothing due today.</p>
      ) : (
        <ul data-testid="today-list">
          {today.map((f) => (
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
