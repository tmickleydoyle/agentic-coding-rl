'use client'
import type { Profile } from '../lib/types'

export default function ConnectionRow({
  profile,
  isFollowing,
  onFollow,
  onView,
}: {
  profile: Profile
  isFollowing: boolean
  onFollow: (id: string) => void
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`conn-${profile.id}`}>
      <span data-testid={`conn-${profile.id}-name`}>{profile.name}</span>
      <button data-testid={`follow-${profile.id}`} onClick={() => onFollow(profile.id)}>
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <button data-testid={`view-${profile.id}`} onClick={() => onView(profile.id)}>
        View
      </button>
    </li>
  )
}
