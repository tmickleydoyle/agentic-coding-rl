import type { Member, Message, Room } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level members/rooms/messages + id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listMembers(): Member[] {
  // TODO: return all members
  return []
}

export function listRooms(): Room[] {
  // TODO: return all rooms
  return []
}

export function listMessages(_filter?: { roomId?: string | null }): Message[] {
  // TODO: return messages, applying an optional roomId filter
  return []
}

export function createMessage(_input: { roomId: string; authorId: string; text: string }): Message {
  // TODO: append a new message with a fresh id and return it
  return { id: '', roomId: '', authorId: '', text: '' }
}

export function findMessage(_id: string): Message | undefined {
  // TODO: look up a message by id
  return undefined
}

export function updateMessage(_id: string, _text: string): Message | undefined {
  // TODO: edit the message text; undefined if absent
  return undefined
}

export function deleteMessage(_id: string): boolean {
  // TODO: remove the message; return whether it existed
  return false
}
