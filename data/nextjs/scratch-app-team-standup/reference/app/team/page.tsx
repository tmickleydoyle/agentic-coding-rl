'use client'
import { useApp } from '../../components/AppStateProvider'
import { entriesForMember } from '../../hooks/useStandup'

export default function TeamPage() {
  const { members, entries } = useApp()
  return (
    <section data-testid="page-team">
      <h1>Team</h1>
      <ul data-testid="team-list">
        {members.map((m) => (
          <li key={m.id} data-testid={`team-member-${m.id}`}>
            <span data-testid={`team-member-${m.id}-name`}>{m.name}</span>
            <span data-testid={`team-member-${m.id}-count`}>
              {entriesForMember(entries, m.id).length}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
