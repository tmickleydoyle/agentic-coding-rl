import type { Group, Person } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let people: Person[] = []
let groups: Group[] = []
let nextGroupId = 1

function seed(): void {
  people = [
    { id: 'u1', name: 'You' },
    { id: 'u2', name: 'Ada' },
    { id: 'u3', name: 'Linus' },
    { id: 'u4', name: 'Grace' },
  ]
  groups = [
    { id: 'g1', name: 'Weekend Plans', adminId: 'u1', memberIds: ['u1', 'u2', 'u3'] },
    { id: 'g2', name: 'Book Club', adminId: 'u2', memberIds: ['u1', 'u2', 'u4'] },
    { id: 'g3', name: 'Founders', adminId: 'u3', memberIds: ['u3', 'u4'] },
  ]
  nextGroupId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listPeople(): Person[] {
  return people.slice()
}

export function listGroups(filter?: { memberId?: string | null }): Group[] {
  let out = groups.slice()
  const memberId = filter?.memberId
  if (memberId) out = out.filter((g) => g.memberIds.includes(memberId))
  return out.map((g) => ({ ...g, memberIds: g.memberIds.slice() }))
}

export function createGroup(input: { name: string; adminId: string }): Group {
  const group: Group = {
    id: `g${nextGroupId++}`,
    name: input.name,
    adminId: input.adminId,
    memberIds: [input.adminId],
  }
  groups.push(group)
  return { ...group, memberIds: group.memberIds.slice() }
}

export function findGroup(id: string): Group | undefined {
  return groups.find((g) => g.id === id)
}

export function patchMembers(
  id: string,
  patch: { add?: string; remove?: string },
): Group | undefined {
  const group = groups.find((g) => g.id === id)
  if (!group) return undefined
  if (patch.add && !group.memberIds.includes(patch.add)) {
    group.memberIds.push(patch.add)
  }
  if (patch.remove && patch.remove !== group.adminId) {
    group.memberIds = group.memberIds.filter((m) => m !== patch.remove)
  }
  return { ...group, memberIds: group.memberIds.slice() }
}

export function deleteGroup(id: string): boolean {
  const idx = groups.findIndex((g) => g.id === id)
  if (idx === -1) return false
  groups.splice(idx, 1)
  return true
}
