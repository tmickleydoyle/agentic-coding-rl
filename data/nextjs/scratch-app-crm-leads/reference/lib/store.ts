import type { Deal, Lead, LeadStatus } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let leads: Lead[] = []
let deals: Deal[] = []
let nextLeadId = 1
let nextDealId = 1

const STATUSES: LeadStatus[] = ['new', 'qualified', 'converted', 'lost']

function seed(): void {
  leads = [
    { id: 'l1', name: 'Ada Byron', source: 'web', score: 80, status: 'new' },
    { id: 'l2', name: 'Grace Hopper', source: 'referral', score: 60, status: 'qualified' },
    { id: 'l3', name: 'Linus T', source: 'event', score: 30, status: 'new' },
    { id: 'l4', name: 'Margaret H', source: 'web', score: 90, status: 'converted' },
  ]
  deals = [{ id: 'd1', leadId: 'l4', title: 'Margaret H deal', value: 5000 }]
  nextLeadId = 5
  nextDealId = 2
}

seed()

export function __reset(): void {
  seed()
}

export function isStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && STATUSES.includes(v as LeadStatus)
}

export function listLeads(filter?: { status?: string | null; minScore?: number | null }): Lead[] {
  let out = leads.slice()
  const status = filter?.status
  if (status) out = out.filter((l) => l.status === status)
  const minScore = filter?.minScore
  if (typeof minScore === 'number') out = out.filter((l) => l.score >= minScore)
  return out
}

export function findLead(id: string): Lead | undefined {
  return leads.find((l) => l.id === id)
}

export function createLead(input: { name: string; source?: string; score?: number }): Lead {
  const lead: Lead = {
    id: `l${nextLeadId++}`,
    name: input.name,
    source: input.source ?? 'web',
    score: typeof input.score === 'number' ? input.score : 0,
    status: 'new',
  }
  leads.push(lead)
  return lead
}

export function updateLead(
  id: string,
  patch: { status?: LeadStatus; score?: number },
): Lead | undefined {
  const lead = leads.find((l) => l.id === id)
  if (!lead) return undefined
  if (patch.status !== undefined) lead.status = patch.status
  if (typeof patch.score === 'number') lead.score = patch.score
  return lead
}

export function deleteLead(id: string): boolean {
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return false
  leads.splice(idx, 1)
  return true
}

export function listDeals(): Deal[] {
  return deals.slice()
}

export function convertLead(id: string, value: number): { lead: Lead; deal: Deal } | undefined {
  const lead = leads.find((l) => l.id === id)
  if (!lead) return undefined
  lead.status = 'converted'
  const deal: Deal = {
    id: `d${nextDealId++}`,
    leadId: lead.id,
    title: `${lead.name} deal`,
    value,
  }
  deals.push(deal)
  return { lead, deal }
}

export function statusCounts(): Record<LeadStatus, number> {
  const counts: Record<LeadStatus, number> = { new: 0, qualified: 0, converted: 0, lost: 0 }
  leads.forEach((l) => {
    counts[l.status] += 1
  })
  return counts
}
