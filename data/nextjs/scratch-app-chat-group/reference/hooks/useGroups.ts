'use client'
import { useApp } from '../components/AppStateProvider'
import type { Group, Person } from '../lib/types'

export type GroupStats = {
  totalGroups: number
  myGroupCount: number
  adminCount: number
}

export function filterMine(groups: Group[], currentUserId: string): Group[] {
  return groups.filter((g) => g.memberIds.includes(currentUserId))
}

export function outsiders(people: Person[], group: Group): Person[] {
  return people.filter((p) => !group.memberIds.includes(p.id))
}

export function computeStats(groups: Group[], currentUserId: string): GroupStats {
  let myGroupCount = 0
  let adminCount = 0
  groups.forEach((g) => {
    if (g.memberIds.includes(currentUserId)) myGroupCount += 1
    if (g.adminId === currentUserId) adminCount += 1
  })
  return {
    totalGroups: groups.length,
    myGroupCount,
    adminCount,
  }
}

export function useGroups() {
  const { people, groups, currentUserId } = useApp()
  const myGroups = filterMine(groups, currentUserId)
  const nonMembers = (group: Group) => outsiders(people, group)
  const stats = computeStats(groups, currentUserId)
  return { myGroups, nonMembers, stats }
}
