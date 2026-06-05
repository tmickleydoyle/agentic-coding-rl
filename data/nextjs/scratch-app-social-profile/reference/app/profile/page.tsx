'use client'
import { useApp } from '../../components/AppStateProvider'
import { useProfile } from '../../hooks/useProfile'
import StatBlock from '../../components/StatBlock'

export default function ProfilePage() {
  const { meId, following, toggleFollow } = useApp()
  const { viewed, viewedId, counts } = useProfile()

  if (!viewed) {
    return (
      <section data-testid="page-profile">
        <p data-testid="no-profile">No profile.</p>
      </section>
    )
  }

  const isMe = viewedId === meId
  const isFollowing = following.includes(viewedId)

  return (
    <section data-testid="page-profile">
      <h1 data-testid="profile-name">{viewed.name}</h1>
      <p data-testid="profile-bio">{viewed.bio}</p>
      <div data-testid="profile-stats">
        <StatBlock label="Posts" value={counts.posts} testid="posts" />
        <StatBlock label="Followers" value={counts.followers} testid="followers" />
        <StatBlock label="Following" value={counts.following} testid="following" />
      </div>
      {!isMe ? (
        <button data-testid="follow-toggle" onClick={() => toggleFollow(viewedId)}>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      ) : null}
    </section>
  )
}
