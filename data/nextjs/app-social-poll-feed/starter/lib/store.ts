import type { Poll } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level polls + an id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listPolls(_filter?: { sort?: string | null }): Poll[] {
  // TODO: return polls, applying ?sort=trending (total votes descending)
  return []
}

export function findPoll(_id: string): Poll | undefined {
  // TODO: look up a poll by id
  return undefined
}

export function createPoll(_input: { question: string; options: string[] }): Poll | null {
  // TODO: create a poll from a question + non-blank option labels; null if invalid
  return null
}

export type VoteResult =
  | { ok: true; poll: Poll }
  | { ok: false; code: 404 | 400 | 409 }

export function votePoll(_pollId: string, _optionId: string): VoteResult {
  // TODO: record a single vote; 404 missing poll, 409 already voted, 400 bad option
  return { ok: false, code: 404 }
}

export function deletePoll(_id: string): boolean {
  // TODO: remove the poll; return whether it existed
  return false
}
