import type { Agent, Canned, Chat, Reply, Status } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level agents/chats/replies/canned + id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listAgents(): Agent[] {
  // TODO: return all agents
  return []
}

export function listCanned(): Canned[] {
  // TODO: return all canned replies
  return []
}

export function listChats(_filter?: { status?: Status | null }): Chat[] {
  // TODO: return chats, applying an optional status filter
  return []
}

export function createChat(_input: { customer: string }): Chat {
  // TODO: append a new chat (status open, agentId null) with a fresh id and return it
  return { id: '', customer: '', status: 'open', agentId: null }
}

export function findChat(_id: string): Chat | undefined {
  // TODO: look up a chat by id
  return undefined
}

export function updateChat(
  _id: string,
  _patch: { status?: Status; agentId?: string | null },
): Chat | undefined {
  // TODO: apply the given status/agentId keys; undefined if absent
  return undefined
}

export function deleteChat(_id: string): boolean {
  // TODO: remove the chat; return whether it existed
  return false
}

export function listReplies(_chatId: string): Reply[] {
  // TODO: return replies for a chat
  return []
}
