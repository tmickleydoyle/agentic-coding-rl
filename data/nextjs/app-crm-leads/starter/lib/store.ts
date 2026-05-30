import type { Deal, Lead, LeadStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level leads/deals + id counters; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isStatus(_v: unknown): _v is LeadStatus {
  // TODO: narrow a value to a valid LeadStatus
  return false
}

export function listLeads(_filter?: { status?: string | null; minScore?: number | null }): Lead[] {
  // TODO: return leads, applying optional status + minScore filters
  return []
}

export function findLead(_id: string): Lead | undefined {
  // TODO: look up a lead by id
  return undefined
}

export function createLead(_input: { name: string; source?: string; score?: number }): Lead {
  // TODO: append a new lead (status 'new') with a fresh id and defaults, return it
  return { id: '', name: '', source: 'web', score: 0, status: 'new' }
}

export function updateLead(
  _id: string,
  _patch: { status?: LeadStatus; score?: number },
): Lead | undefined {
  // TODO: apply the patch and return the updated lead, or undefined if absent
  return undefined
}

export function deleteLead(_id: string): boolean {
  // TODO: remove the lead; return whether it existed
  return false
}

export function listDeals(): Deal[] {
  // TODO: return all deals
  return []
}

export function convertLead(_id: string, _value: number): { lead: Lead; deal: Deal } | undefined {
  // TODO: set the lead converted, append a deal, return both; undefined if absent
  return undefined
}

export function statusCounts(): Record<LeadStatus, number> {
  // TODO: count leads per status
  return { new: 0, qualified: 0, converted: 0, lost: 0 }
}
