'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ProfilePage() {
  const { users, posts, currentUserId, selectedUserId, following, toggleFollow } = useApp()

  const userId = selectedUserId ?? currentUserId
  const user = users.find((u) => u.id === userId)
  if (!user) {
    return (
      <section data-testid="page-profile">
        <p data-testid="no-user-selected">No user.</p>
      </section>
    )
  }

  const userPosts = posts.filter((p) => p.authorId === user.id)
  const isSelf = user.id === currentUserId
  const isFollowing = following.includes(user.id)

  return (
    <section data-testid="page-profile">
      <h1>Profile</h1>
      <span data-testid="profile-name">{user.name}</span>
      <span data-testid="profile-handle">{user.handle}</span>
      <span data-testid="profile-post-count">{userPosts.length}</span>
      {!isSelf ? (
        <button data-testid="follow-toggle" onClick={() => toggleFollow(user.id)}>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      ) : null}
      <ul data-testid="profile-posts">
        {userPosts.map((p) => (
          <li key={p.id} data-testid={`profile-post-${p.id}`}>
            <span data-testid={`profile-post-${p.id}-text`}>{p.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
