'use client'
import { useApp } from '../../components/AppStateProvider'
import { useBoard } from '../../hooks/useBoard'

export default function MembersPage() {
  const { members } = useApp()
  const { workload } = useBoard()
  return (
    <section data-testid="page-members">
      <h1>Members</h1>
      <ul data-testid="member-list">
        {members.map((m) => (
          <li key={m.id} data-testid={`member-${m.id}`}>
            <span data-testid={`member-${m.id}-name`}>{m.name}</span>
            <span data-testid={`member-${m.id}-load`}>{workload[m.id] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
