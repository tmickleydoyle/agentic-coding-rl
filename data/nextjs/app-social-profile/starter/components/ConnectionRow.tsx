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
  // TODO: render name, a follow-<id> button and a view-<id> button.
  void isFollowing
  void onFollow
  void onView
  return <li data-testid={`conn-${profile.id}`} />
}
