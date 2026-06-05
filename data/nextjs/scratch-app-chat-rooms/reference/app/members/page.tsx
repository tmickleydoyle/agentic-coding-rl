'use client'
import { useApp } from '../../components/AppStateProvider'
import { useRooms } from '../../hooks/useRooms'
import MemberRow from '../../components/MemberRow'

export default function MembersPage() {
  const { members } = useApp()
  const { stats } = useRooms()

  return (
    <section data-testid="page-members">
      <h1>Members</h1>
      <div data-testid="room-stats">
        <span data-testid="stat-rooms">{stats.totalRooms}</span>
        <span data-testid="stat-messages">{stats.totalMessages}</span>
        <span data-testid="stat-unread">{stats.totalUnread}</span>
      </div>
      <ul data-testid="members-list">
        {members.map((m) => (
          <MemberRow key={m.id} member={m} />
        ))}
      </ul>
    </section>
  )
}
