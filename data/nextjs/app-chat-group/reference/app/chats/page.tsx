'use client'
import { useApp } from '../../components/AppStateProvider'
import { useGroups } from '../../hooks/useGroups'
import GroupRow from '../../components/GroupRow'

export default function ChatsPage() {
  const { openGroup } = useApp()
  const { myGroups } = useGroups()

  return (
    <section data-testid="page-chats">
      <h1>Chats</h1>
      <span data-testid="chats-count">{myGroups.length}</span>
      <ul data-testid="chats-list">
        {myGroups.map((g) => (
          <GroupRow key={g.id} group={g} onOpen={openGroup} />
        ))}
      </ul>
    </section>
  )
}
