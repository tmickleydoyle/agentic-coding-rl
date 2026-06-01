'use client'
import { useApp } from '../components/AppStateProvider'
import type { ApiKey, StatusFilter } from '../lib/types'

export type KeyCounts = {
  total: number
  active: number
  revoked: number
  totalUsage: number
}

export function countKeys(keys: ApiKey[]): KeyCounts {
  let active = 0
  let totalUsage = 0
  keys.forEach((k) => {
    if (k.active) active += 1
    totalUsage += k.usageCount
  })
  return {
    total: keys.length,
    active,
    revoked: keys.length - active,
    totalUsage,
  }
}

export function filterKeys(keys: ApiKey[], statusFilter: StatusFilter): ApiKey[] {
  if (statusFilter === 'active') return keys.filter((k) => k.active)
  if (statusFilter === 'revoked') return keys.filter((k) => !k.active)
  return keys.slice()
}

export function useKeys() {
  const { keys, statusFilter } = useApp()
  const counts = countKeys(keys)
  const filtered = filterKeys(keys, statusFilter)
  return { counts, filtered }
}
