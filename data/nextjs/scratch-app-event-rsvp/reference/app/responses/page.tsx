'use client'
import { useApp } from '../../components/AppStateProvider'
import InviteRow from '../../components/InviteRow'
import { useResponses } from '../../hooks/useResponses'

export default function ResponsesPage() {
  const { events, selectedEventId, headcount, selectInvite } = useApp()
  const { tally } = useResponses()
  const event = events.find((e) => e.id === selectedEventId)

  if (!event) {
    return (
      <section data-testid="page-responses">
        <h1>Responses</h1>
        <p data-testid="no-event">No event selected.</p>
      </section>
    )
  }

  const counts = tally(event.id)

  return (
    <section data-testid="page-responses">
      <h1 data-testid="event-name">{event.name}</h1>
      <span data-testid="event-headcount">{headcount(event.id)}</span>
      <span data-testid="tally-yes">{counts.yes}</span>
      <span data-testid="tally-no">{counts.no}</span>
      <span data-testid="tally-maybe">{counts.maybe}</span>
      <span data-testid="tally-pending">{counts.pending}</span>
      <ul data-testid="invites-list">
        {event.invites.map((i) => (
          <InviteRow
            key={i.id}
            invite={i}
            onEdit={(inviteId) => selectInvite(event.id, inviteId)}
          />
        ))}
      </ul>
    </section>
  )
}
