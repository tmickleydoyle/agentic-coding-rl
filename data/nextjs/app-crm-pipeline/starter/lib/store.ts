import type { Contact, Deal, Stage } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level contacts/deals + an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isStage(_v: unknown): _v is Stage {
  // TODO: narrow a value to a valid Stage
  return false
}

export function listContacts(): Contact[] {
  // TODO: return all contacts
  return []
}

export function listDeals(_filter?: { stage?: string | null; contactId?: string | null }): Deal[] {
  // TODO: return deals, applying optional stage + contactId filters
  return []
}

export function findDeal(_id: string): Deal | undefined {
  // TODO: look up a deal by id
  return undefined
}

export function createDeal(_input: {
  title: string
  value?: number
  stage?: Stage
  contactId?: string
}): Deal {
  // TODO: append a new deal with a fresh id and defaults, return it
  return { id: '', title: '', value: 0, stage: 'lead', contactId: '' }
}

export function updateDeal(
  _id: string,
  _patch: { stage?: Stage; value?: number; title?: string },
): Deal | undefined {
  // TODO: apply the patch and return the updated deal, or undefined if absent
  return undefined
}

export function deleteDeal(_id: string): boolean {
  // TODO: remove the deal; return whether it existed
  return false
}

export function stageRollup(): Array<{ stage: Stage; count: number; value: number }> {
  // TODO: per-stage count and summed value over all five stages
  return []
}
