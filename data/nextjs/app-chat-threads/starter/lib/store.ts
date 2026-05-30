import type { Member, Message, Reply } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level members/messages/replies + id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listMembers(): Member[] {
  // TODO: return all members
  return []
}

export function listMessages(_filter?: { resolved?: boolean }): Message[] {
  // TODO: return messages, applying an optional resolved filter
  return []
}

export function createMessage(_input: { authorId: string; text: string }): Message {
  // TODO: append a new message (resolved false) with a fresh id and return it
  return { id: '', authorId: '', text: '', resolved: false }
}

export function findMessage(_id: string): Message | undefined {
  // TODO: look up a message by id
  return undefined
}

export function setResolved(_id: string, _resolved?: boolean): Message | undefined {
  // TODO: set/toggle resolved; undefined if absent
  return undefined
}

export function deleteMessage(_id: string): boolean {
  // TODO: remove the message; return whether it existed
  return false
}

export function listReplies(_messageId: string): Reply[] {
  // TODO: return replies for a message
  return []
}
