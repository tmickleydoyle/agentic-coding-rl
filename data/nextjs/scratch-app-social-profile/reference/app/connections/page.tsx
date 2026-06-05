'use client'
import { useApp } from '../../components/AppStateProvider'
import ConnectionRow from '../../components/ConnectionRow'

export default function ConnectionsPage() {
  const { profiles, meId, following, followers, toggleFollow, viewUser } = useApp()

  const others = profiles.filter((p) => p.id !== meId)

  return (
    <section data-testid="page-connections">
      <h1>Connections</h1>
      <span data-testid="following-count">{following.length}</span>
      <span data-testid="followers-count">{followers.length}</span>
      <ul data-testid="conn-list">
        {others.map((p) => (
          <ConnectionRow
            key={p.id}
            profile={p}
            isFollowing={following.includes(p.id)}
            onFollow={toggleFollow}
            onView={viewUser}
          />
        ))}
      </ul>
    </section>
  )
}
