import type { Contact, Deal, Stage } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let contacts: Contact[] = []
let deals: Deal[] = []
let nextDealId = 1

const STAGES: Stage[] = ['lead', 'qualified', 'proposal', 'won', 'lost']

function seed(): void {
  contacts = [
    { id: 'c1', name: 'Ada Byron', company: 'Analytical' },
    { id: 'c2', name: 'Grace Hopper', company: 'Navy' },
    { id: 'c3', name: 'Linus T', company: 'Kernel' },
  ]
  deals = [
    { id: 'd1', title: 'Analytical license', value: 5000, stage: 'qualified', contactId: 'c1' },
    { id: 'd2', title: 'Navy rollout', value: 12000, stage: 'proposal', contactId: 'c2' },
    { id: 'd3', title: 'Kernel support', value: 8000, stage: 'won', contactId: 'c3' },
    { id: 'd4', title: 'Analytical addon', value: 3000, stage: 'lead', contactId: 'c1' },
  ]
  nextDealId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function isStage(v: unknown): v is Stage {
  return typeof v === 'string' && STAGES.includes(v as Stage)
}

export function listContacts(): Contact[] {
  return contacts.slice()
}

export function listDeals(filter?: { stage?: string | null; contactId?: string | null }): Deal[] {
  let out = deals.slice()
  const stage = filter?.stage
  if (stage) out = out.filter((d) => d.stage === stage)
  const contactId = filter?.contactId
  if (contactId) out = out.filter((d) => d.contactId === contactId)
  return out
}

export function findDeal(id: string): Deal | undefined {
  return deals.find((d) => d.id === id)
}

export function createDeal(input: {
  title: string
  value?: number
  stage?: Stage
  contactId?: string
}): Deal {
  const deal: Deal = {
    id: `d${nextDealId++}`,
    title: input.title,
    value: typeof input.value === 'number' ? input.value : 0,
    stage: input.stage ?? 'lead',
    contactId: input.contactId ?? 'c1',
  }
  deals.push(deal)
  return deal
}

export function updateDeal(
  id: string,
  patch: { stage?: Stage; value?: number; title?: string },
): Deal | undefined {
  const deal = deals.find((d) => d.id === id)
  if (!deal) return undefined
  if (patch.stage !== undefined) deal.stage = patch.stage
  if (typeof patch.value === 'number') deal.value = patch.value
  if (typeof patch.title === 'string') deal.title = patch.title
  return deal
}

export function deleteDeal(id: string): boolean {
  const idx = deals.findIndex((d) => d.id === id)
  if (idx === -1) return false
  deals.splice(idx, 1)
  return true
}

export function stageRollup(): Array<{ stage: Stage; count: number; value: number }> {
  return STAGES.map((stage) => {
    const inStage = deals.filter((d) => d.stage === stage)
    return {
      stage,
      count: inStage.length,
      value: inStage.reduce((sum, d) => sum + d.value, 0),
    }
  })
}
