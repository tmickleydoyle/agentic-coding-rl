import type { Agent, Canned, Chat, Reply, Status } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let agents: Agent[] = []
let chats: Chat[] = []
let replies: Reply[] = []
let canned: Canned[] = []
let nextChatId = 1

function seed(): void {
  agents = [
    { id: 'a1', name: 'You' },
    { id: 'a2', name: 'Sam' },
  ]
  chats = [
    { id: 'c1', customer: 'Alice', status: 'open', agentId: 'a1' },
    { id: 'c2', customer: 'Bob', status: 'open', agentId: null },
    { id: 'c3', customer: 'Cara', status: 'closed', agentId: 'a2' },
  ]
  canned = [
    { id: 'k1', label: 'Greeting', text: 'Hi, how can I help?' },
    { id: 'k2', label: 'Closing', text: 'Glad I could help!' },
  ]
  replies = [
    { id: 'y1', chatId: 'c1', authorId: 'Alice', text: 'My order is late' },
    { id: 'y2', chatId: 'c1', authorId: 'a1', text: 'Let me check' },
    { id: 'y3', chatId: 'c3', authorId: 'a2', text: 'All sorted' },
  ]
  nextChatId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listAgents(): Agent[] {
  return agents.slice()
}

export function listCanned(): Canned[] {
  return canned.slice()
}

export function listChats(filter?: { status?: Status | null }): Chat[] {
  let out = chats.slice()
  const status = filter?.status
  if (status === 'open' || status === 'closed') out = out.filter((c) => c.status === status)
  return out
}

export function createChat(input: { customer: string }): Chat {
  const chat: Chat = {
    id: `c${nextChatId++}`,
    customer: input.customer,
    status: 'open',
    agentId: null,
  }
  chats.push(chat)
  return chat
}

export function findChat(id: string): Chat | undefined {
  return chats.find((c) => c.id === id)
}

export function updateChat(
  id: string,
  patch: { status?: Status; agentId?: string | null },
): Chat | undefined {
  const chat = chats.find((c) => c.id === id)
  if (!chat) return undefined
  if (patch.status === 'open' || patch.status === 'closed') chat.status = patch.status
  if ('agentId' in patch) chat.agentId = patch.agentId ?? null
  return chat
}

export function deleteChat(id: string): boolean {
  const idx = chats.findIndex((c) => c.id === id)
  if (idx === -1) return false
  chats.splice(idx, 1)
  return true
}

export function listReplies(chatId: string): Reply[] {
  return replies.filter((r) => r.chatId === chatId)
}
