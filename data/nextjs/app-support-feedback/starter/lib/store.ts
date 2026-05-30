import type { Feedback, FeedbackStatus, Sentiment } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level feedback items + id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listFeedback(_filter?: { category?: string | null; status?: string | null }): Feedback[] {
  // TODO: return items, applying optional category + status filters
  return []
}

export function findFeedback(_id: string): Feedback | undefined {
  // TODO: look up an item by id
  return undefined
}

export function createFeedback(_input: {
  author: string
  message: string
  category?: string
  sentiment?: Sentiment
}): Feedback {
  // TODO: append a new item with a fresh id (status 'new') and return it
  return { id: '', author: '', message: '', category: '', sentiment: 'neutral', status: 'new' }
}

export function setStatus(_id: string, _status: FeedbackStatus): Feedback | undefined {
  // TODO: update the item's status and return it, or undefined if absent
  return undefined
}

export function isSentiment(value: unknown): value is Sentiment {
  return value === 'positive' || value === 'neutral' || value === 'negative'
}

export function isStatus(value: unknown): value is FeedbackStatus {
  return value === 'new' || value === 'reviewed' || value === 'resolved'
}
