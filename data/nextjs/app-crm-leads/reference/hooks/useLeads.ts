'use client'
import { useApp } from '../components/AppStateProvider'
import type { Lead, LeadStatus, StatusFilter } from '../lib/types'

export function filterLeads(leads: Lead[], filter: StatusFilter): Lead[] {
  if (filter === 'all') return leads
  return leads.filter((l) => l.status === filter)
}

export function countByStatus(leads: Lead[]): Record<LeadStatus, number> {
  const counts: Record<LeadStatus, number> = { new: 0, qualified: 0, converted: 0, lost: 0 }
  leads.forEach((l) => {
    counts[l.status] += 1
  })
  return counts
}

export function avgScore(leads: Lead[]): number {
  if (leads.length === 0) return 0
  const sum = leads.reduce((acc, l) => acc + l.score, 0)
  return Math.round(sum / leads.length)
}

export function useLeads() {
  const { leads, statusFilter } = useApp()
  return {
    visible: filterLeads(leads, statusFilter),
    counts: countByStatus(leads),
    avgScore: avgScore(leads),
  }
}
