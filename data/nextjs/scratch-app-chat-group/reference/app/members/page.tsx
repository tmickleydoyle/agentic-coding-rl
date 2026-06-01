'use client'
import { useApp } from '../../components/AppStateProvider'
import { useGroups } from '../../hooks/useGroups'
import PersonRow from '../../components/PersonRow'

export default function MembersPage() {
  const { people } = useApp()
  const { stats } = useGroups()

  return (
    <section data-testid="page-members">
      <h1>Members</h1>
      <div data-testid="group-stats">
        <span data-testid="stat-total">{stats.totalGroups}</span>
        <span data-testid="stat-mine">{stats.myGroupCount}</span>
        <span data-testid="stat-admin">{stats.adminCount}</span>
      </div>
      <ul data-testid="people-list">
        {people.map((p) => (
          <PersonRow key={p.id} person={p} />
        ))}
      </ul>
    </section>
  )
}
