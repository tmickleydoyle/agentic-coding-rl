'use client'
import { useApp } from '../components/AppStateProvider'
import type { Group, Person } from '../lib/types'

export type GroupStats = {
  totalGroups: number
  myGroupCount: number
  adminCount: number
}

export function filterMine(_groups: Group[], _currentUserId: string): Group[] {
  // TODO: groups whose memberIds include the current user
  return []
}

export function outsiders(_people: Person[], _group: Group): Person[] {
  // TODO: people not in the group
  return []
}

export function computeStats(_groups: Group[], _currentUserId: string): GroupStats {
  // TODO: total groups, my group count, admin count
  return { totalGroups: 0, myGroupCount: 0, adminCount: 0 }
}

export function useGroups() {
  const { people, groups, currentUserId } = useApp()
  const myGroups = filterMine(groups, currentUserId)
  const nonMembers = (group: Group) => outsiders(people, group)
  const stats = computeStats(groups, currentUserId)
  return { myGroups, nonMembers, stats }
}
