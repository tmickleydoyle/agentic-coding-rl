'use client'
import type { User } from '../lib/types'

export default function UserRow({
  user,
  isFollowing,
  onFollow,
  onVisit,
}: {
  user: User
  isFollowing: boolean
  onFollow: (id: string) => void
  onVisit: (id: string) => void
}) {
  return (
    <li data-testid={`user-${user.id}`}>
      <span data-testid={`user-${user.id}-name`}>{user.name}</span>
      <span data-testid={`user-${user.id}-handle`}>{user.handle}</span>
      <button data-testid={`follow-${user.id}`} onClick={() => onFollow(user.id)}>
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <button data-testid={`visit-${user.id}`} onClick={() => onVisit(user.id)}>
        Visit
      </button>
    </li>
  )
}
