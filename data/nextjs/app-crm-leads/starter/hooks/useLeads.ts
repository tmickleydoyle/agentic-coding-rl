'use client'
import { useApp } from '../components/AppStateProvider'
import type { Lead, LeadStatus, StatusFilter } from '../lib/types'

export function filterLeads(_leads: Lead[], _filter: StatusFilter): Lead[] {
  // TODO: return leads matching the status filter ('all' keeps everything)
  return []
}

export function countByStatus(_leads: Lead[]): Record<LeadStatus, number> {
  // TODO: count leads per status
  return { new: 0, qualified: 0, converted: 0, lost: 0 }
}

export function avgScore(_leads: Lead[]): number {
  // TODO: rounded mean score over all leads; 0 if empty
  return 0
}

export function useLeads() {
  const { leads, statusFilter } = useApp()
  return {
    visible: filterLeads(leads, statusFilter),
    counts: countByStatus(leads),
    avgScore: avgScore(leads),
  }
}
