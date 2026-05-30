'use client'
import { useApp } from '../components/AppStateProvider'
import type { ApiKey, StatusFilter } from '../lib/types'

export type KeyCounts = {
  total: number
  active: number
  revoked: number
  totalUsage: number
}

export function countKeys(_keys: ApiKey[]): KeyCounts {
  // TODO: compute total/active/revoked and totalUsage
  return { total: 0, active: 0, revoked: 0, totalUsage: 0 }
}

export function filterKeys(_keys: ApiKey[], _statusFilter: StatusFilter): ApiKey[] {
  // TODO: apply the status filter ('all' returns everything)
  return []
}

export function useKeys() {
  const { keys, statusFilter } = useApp()
  const counts = countKeys(keys)
  const filtered = filterKeys(keys, statusFilter)
  return { counts, filtered }
}
