import type { Member, Message, Reply } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let members: Member[] = []
let messages: Message[] = []
let replies: Reply[] = []
let nextMessageId = 1

function seed(): void {
  members = [
    { id: 'u1', name: 'You', handle: '@you' },
    { id: 'u2', name: 'Ada', handle: '@ada' },
    { id: 'u3', name: 'Linus', handle: '@linus' },
  ]
  messages = [
    { id: 'm1', authorId: 'u2', text: 'Deploy failing', resolved: false },
    { id: 'm2', authorId: 'u3', text: 'Lunch spot ideas', resolved: false },
    { id: 'm3', authorId: 'u1', text: 'Docs updated', resolved: true },
  ]
  replies = [
    { id: 'r1', messageId: 'm1', authorId: 'u1', text: 'Looking now' },
    { id: 'r2', messageId: 'm1', authorId: 'u3', text: 'Same here' },
    { id: 'r3', messageId: 'm1', authorId: 'u2', text: 'Fixed it' },
    { id: 'r4', messageId: 'm2', authorId: 'u1', text: 'Tacos' },
  ]
  nextMessageId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listMembers(): Member[] {
  return members.slice()
}

export function listMessages(filter?: { resolved?: boolean }): Message[] {
  let out = messages.slice()
  if (typeof filter?.resolved === 'boolean') {
    out = out.filter((m) => m.resolved === filter.resolved)
  }
  return out
}

export function createMessage(input: { authorId: string; text: string }): Message {
  const message: Message = {
    id: `m${nextMessageId++}`,
    authorId: input.authorId,
    text: input.text,
    resolved: false,
  }
  messages.push(message)
  return message
}

export function findMessage(id: string): Message | undefined {
  return messages.find((m) => m.id === id)
}

export function setResolved(id: string, resolved?: boolean): Message | undefined {
  const message = messages.find((m) => m.id === id)
  if (!message) return undefined
  message.resolved = typeof resolved === 'boolean' ? resolved : !message.resolved
  return message
}

export function deleteMessage(id: string): boolean {
  const idx = messages.findIndex((m) => m.id === id)
  if (idx === -1) return false
  messages.splice(idx, 1)
  return true
}

export function listReplies(messageId: string): Reply[] {
  return replies.filter((r) => r.messageId === messageId)
}
