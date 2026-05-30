'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFeed } from '../../hooks/useFeed'
import UserRow from '../../components/UserRow'

export default function ExplorePage() {
  const { users, currentUserId, following, toggleFollow, openProfile } = useApp()
  const { stats } = useFeed()

  const others = users.filter((u) => u.id !== currentUserId)

  return (
    <section data-testid="page-explore">
      <h1>Explore</h1>
      <div data-testid="explore-stats">
        <span data-testid="stat-posts">{stats.totalPosts}</span>
        <span data-testid="stat-likes">{stats.totalLikes}</span>
        <span data-testid="stat-following">{stats.followingCount}</span>
      </div>
      <ul data-testid="user-list">
        {others.map((u) => (
          <UserRow
            key={u.id}
            user={u}
            isFollowing={following.includes(u.id)}
            onFollow={toggleFollow}
            onVisit={openProfile}
          />
        ))}
      </ul>
    </section>
  )
}
