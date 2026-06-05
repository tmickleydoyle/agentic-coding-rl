'use client'
import { useCrm } from '../components/AppStateProvider'
import { STATUS_ORDER, type Lead, type LeadStatus, type StatusFilter } from '../lib/types'

export function filterLeads(leads: Lead[], statusFilter: StatusFilter): Lead[] {
  if (statusFilter === 'all') return leads.slice()
  return leads.filter((l) => l.status === statusFilter)
}

export function pipelineCounts(leads: Lead[]): Record<LeadStatus, number> {
  const counts: Record<LeadStatus, number> = { new: 0, touring: 0, offer: 0, closed: 0 }
  leads.forEach((l) => {
    counts[l.status] += 1
  })
  return counts
}

export function usePipeline() {
  const { leads, statusFilter } = useCrm()
  const filtered = filterLeads(leads, statusFilter)
  const counts = pipelineCounts(leads)
  const stages = STATUS_ORDER.map((status) => ({
    status,
    leads: leads.filter((l) => l.status === status),
  }))
  return { filtered, counts, stages }
}
