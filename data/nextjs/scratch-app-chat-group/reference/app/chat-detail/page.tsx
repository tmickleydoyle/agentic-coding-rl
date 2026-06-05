'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useGroups } from '../../hooks/useGroups'
import MemberItem from '../../components/MemberItem'

export default function ChatDetailPage() {
  const { people, groups, currentUserId, selectedGroupId, addMember, removeMember, leaveGroup } =
    useApp()
  const { nonMembers } = useGroups()
  const [pick, setPick] = useState('')

  const group = groups.find((g) => g.id === selectedGroupId)
  if (!group) {
    return (
      <section data-testid="page-chat-detail">
        <p data-testid="no-group-selected">No group selected.</p>
      </section>
    )
  }

  const name = (id: string): string => people.find((p) => p.id === id)?.name ?? 'Unknown'
  const members = group.memberIds
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is { id: string; name: string } => p !== undefined)
  const candidates = nonMembers(group)
  const isAdmin = group.adminId === currentUserId

  const onAdd = () => {
    if (pick === '') return
    addMember(group.id, pick)
    setPick('')
  }

  return (
    <section data-testid="page-chat-detail">
      <h1 data-testid="detail-name">{group.name}</h1>
      <span data-testid="detail-admin">{name(group.adminId)}</span>
      <ul data-testid="member-list">
        {members.map((m) => (
          <MemberItem
            key={m.id}
            person={m}
            isAdmin={m.id === group.adminId}
            onRemove={(id) => removeMember(group.id, id)}
          />
        ))}
      </ul>
      <select data-testid="add-select" value={pick} onChange={(e) => setPick(e.target.value)}>
        <option value="">Add member…</option>
        {candidates.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button data-testid="add-submit" onClick={onAdd}>
        Add
      </button>
      {isAdmin ? null : (
        <button data-testid="leave-group" onClick={() => leaveGroup(group.id)}>
          Leave
        </button>
      )}
    </section>
  )
}
