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
  // TODO: render the user name/handle, a follow-<id> button and a visit-<id> button.
  void isFollowing
  void onFollow
  void onVisit
  return <li data-testid={`user-${user.id}`} />
}
