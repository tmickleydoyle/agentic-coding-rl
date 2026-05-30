'use client'
import type { FollowUp } from '../lib/types'

export default function FollowUpItem({
  followup,
  contactName,
  onToggle,
  onRemove,
}: {
  followup: FollowUp
  contactName: string
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`task-${followup.id}`} data-done={followup.done ? 'true' : 'false'}>
      <span data-testid={`task-${followup.id}-title`}>{followup.title}</span>
      <span data-testid={`task-${followup.id}-contact`}>{contactName}</span>
      <span data-testid={`task-${followup.id}-due`}>{followup.dueDate}</span>
      <button data-testid={`toggle-${followup.id}`} onClick={() => onToggle(followup.id)}>
        {followup.done ? 'Reopen' : 'Complete'}
      </button>
      <button data-testid={`remove-${followup.id}`} onClick={() => onRemove(followup.id)}>
        Remove
      </button>
    </li>
  )
}
