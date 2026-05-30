'use client'
import type { Invite } from '../lib/types'

export default function InviteRow({
  invite,
  onEdit,
}: {
  invite: Invite
  onEdit: (inviteId: string) => void
}) {
  return (
    <li data-testid={`invite-${invite.id}`}>
      <span data-testid={`invite-${invite.id}-guest`}>{invite.guest}</span>
      <span data-testid={`invite-${invite.id}-status`}>{invite.status}</span>
      <span data-testid={`invite-${invite.id}-extra`}>{invite.extraGuests}</span>
      <button data-testid={`edit-${invite.id}`} onClick={() => onEdit(invite.id)}>
        Edit
      </button>
    </li>
  )
}
