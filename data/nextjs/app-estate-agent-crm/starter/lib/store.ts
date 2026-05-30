import type { Lead, LeadStatus, Property } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `leads`, `properties`, id counter; seed them; provide __reset().

export function isValidStatus(_s: unknown): _s is LeadStatus {
  // TODO: true only for 'new' | 'touring' | 'offer' | 'closed'
  return false
}

export function listLeads(_filter?: { status?: string | null }): Lead[] {
  // TODO: return leads, applying optional status filter
  return []
}

export function findLead(_id: string): Lead | undefined {
  // TODO: look up a lead by id
  return undefined
}

export function createLead(_input: {
  name: string
  status?: string
  propertyId?: string | null
}): Lead {
  // TODO: append a new lead (status default 'new', propertyId default null) and return it
  return { id: '', name: '', status: 'new', propertyId: null }
}

export function updateLead(
  _id: string,
  _patch: { status?: LeadStatus; propertyId?: string | null },
): Lead | undefined {
  // TODO: apply the patch and return the updated lead, or undefined if absent
  return undefined
}

export function deleteLead(_id: string): boolean {
  // TODO: remove the lead; return whether it existed
  return false
}

export function listProperties(): Property[] {
  // TODO: return all properties
  return []
}

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}
