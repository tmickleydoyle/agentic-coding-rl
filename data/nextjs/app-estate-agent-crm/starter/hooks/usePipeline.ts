'use client'
import { useCrm } from '../components/AppStateProvider'
import type { Lead, LeadStatus, StatusFilter } from '../lib/types'

export function filterLeads(_leads: Lead[], _statusFilter: StatusFilter): Lead[] {
  // TODO: return leads matching the status filter ('all' keeps everything)
  return []
}

export function pipelineCounts(_leads: Lead[]): Record<LeadStatus, number> {
  // TODO: count leads per status
  return { new: 0, touring: 0, offer: 0, closed: 0 }
}

export function usePipeline() {
  const { leads, statusFilter } = useCrm()
  void leads
  void statusFilter
  // TODO: derive filtered, counts and stages (in STATUS_ORDER)
  const filtered: Lead[] = []
  const counts: Record<LeadStatus, number> = { new: 0, touring: 0, offer: 0, closed: 0 }
  const stages: { status: LeadStatus; leads: Lead[] }[] = []
  return { filtered, counts, stages }
}
