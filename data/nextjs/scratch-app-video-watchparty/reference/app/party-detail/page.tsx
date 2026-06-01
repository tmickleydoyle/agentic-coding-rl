'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { findParty } from '../../hooks/useParties'
import QueueItem from '../../components/QueueItem'

export default function PartyDetailPage() {
  const { parties, selectedPartyId, partyStatus, toggleRsvp, queueVideo, removeFromQueue } =
    useApp()
  const [draft, setDraft] = useState('')
  const party = findParty(parties, selectedPartyId)

  if (!party) {
    return (
      <section data-testid="page-party-detail">
        <p data-testid="no-party">No party selected.</p>
      </section>
    )
  }

  const onAdd = () => {
    queueVideo(party.id, draft)
    setDraft('')
  }

  return (
    <section data-testid="page-party-detail">
      <h1 data-testid="detail-title">{party.title}</h1>
      <span data-testid="detail-status">{partyStatus(party)}</span>
      <button data-testid="rsvp-toggle" onClick={() => toggleRsvp(party.id)}>
        {party.rsvped ? 'Cancel RSVP' : 'RSVP'}
      </button>
      {party.rsvped ? <span data-testid="rsvp-flag">Going</span> : null}
      <span data-testid="queue-count">{party.queue.length}</span>
      <ul data-testid="queue-list">
        {party.queue.map((title, i) => (
          <QueueItem
            key={`${title}-${i}`}
            index={i}
            title={title}
            onRemove={(index) => removeFromQueue(party.id, index)}
          />
        ))}
      </ul>
      <input
        data-testid="queue-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button data-testid="queue-add" onClick={onAdd}>
        Add
      </button>
    </section>
  )
}
