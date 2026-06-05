import type { Lead, LeadStatus, Property } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

const VALID_STATUS: LeadStatus[] = ['new', 'touring', 'offer', 'closed']

let leads: Lead[] = []
let properties: Property[] = []
let nextId = 1

function seed(): void {
  properties = [
    { id: 'p1', address: '12 Oak St' },
    { id: 'p2', address: '500 Pine Ave' },
  ]
  leads = [
    { id: 'l1', name: 'Ava Stone', status: 'new', propertyId: null },
    { id: 'l2', name: 'Ben Cole', status: 'touring', propertyId: 'p1' },
    { id: 'l3', name: 'Cara Diaz', status: 'offer', propertyId: 'p2' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function isValidStatus(s: unknown): s is LeadStatus {
  return typeof s === 'string' && VALID_STATUS.indexOf(s as LeadStatus) !== -1
}

export function listLeads(filter?: { status?: string | null }): Lead[] {
  let out = leads.slice()
  const status = filter?.status
  if (status && status !== 'all') out = out.filter((l) => l.status === status)
  return out
}

export function findLead(id: string): Lead | undefined {
  return leads.find((l) => l.id === id)
}

export function createLead(input: { name: string; status?: string; propertyId?: string | null }): Lead {
  const status: LeadStatus = isValidStatus(input.status) ? input.status : 'new'
  const lead: Lead = {
    id: `l${nextId++}`,
    name: input.name,
    status,
    propertyId: input.propertyId ?? null,
  }
  leads.push(lead)
  return lead
}

export function updateLead(
  id: string,
  patch: { status?: LeadStatus; propertyId?: string | null },
): Lead | undefined {
  const lead = leads.find((l) => l.id === id)
  if (!lead) return undefined
  if (patch.status) lead.status = patch.status
  if (patch.propertyId !== undefined) lead.propertyId = patch.propertyId
  return lead
}

export function deleteLead(id: string): boolean {
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return false
  leads.splice(idx, 1)
  return true
}

export function listProperties(): Property[] {
  return properties.slice()
}
