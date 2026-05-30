'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { RSVP_VALUES, type Rsvp } from '../../lib/types'

export default function InviteDetailPage() {
  const { events, selectedEventId, selectedInviteId, respond, navigate } = useApp()
  const event = events.find((e) => e.id === selectedEventId)
  const invite = event?.invites.find((i) => i.id === selectedInviteId)

  const [status, setStatus] = useState<Rsvp>(invite?.status ?? 'pending')
  const [extra, setExtra] = useState(invite?.extraGuests ?? 0)
  const [error, setError] = useState(false)

  if (!event || !invite) {
    return (
      <section data-testid="page-invite-detail">
        <h1>Invite</h1>
        <p data-testid="no-invite">No invite selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = respond(event.id, invite.id, status, extra)
    if (!ok) {
      setError(true)
      return
    }
    setError(false)
    navigate('responses')
  }

  return (
    <section data-testid="page-invite-detail">
      <h1 data-testid="invite-guest">{invite.guest}</h1>
      <form data-testid="rsvp-form" onSubmit={onSubmit}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          data-testid="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as Rsvp)}
        >
          {RSVP_VALUES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <label htmlFor="extra">Extra guests</label>
        <input
          id="extra"
          type="number"
          data-testid="extra-input"
          value={extra}
          onChange={(e) => setExtra(Number(e.target.value))}
        />

        {error ? <p data-testid="form-error">Could not save RSVP.</p> : null}

        <button type="submit" data-testid="submit-rsvp">
          Save RSVP
        </button>
      </form>
    </section>
  )
}
