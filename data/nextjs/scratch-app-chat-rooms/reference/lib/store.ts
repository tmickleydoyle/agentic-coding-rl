import type { Member, Message, Room } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let members: Member[] = []
let rooms: Room[] = []
let messages: Message[] = []
let nextMessageId = 1

function seed(): void {
  members = [
    { id: 'u1', name: 'You', handle: '@you' },
    { id: 'u2', name: 'Ada', handle: '@ada' },
    { id: 'u3', name: 'Linus', handle: '@linus' },
  ]
  rooms = [
    { id: 'r1', name: 'General', topic: 'Company wide' },
    { id: 'r2', name: 'Random', topic: 'Off topic' },
    { id: 'r3', name: 'Dev', topic: 'Engineering' },
  ]
  messages = [
    { id: 'm1', roomId: 'r1', authorId: 'u2', text: 'Morning all' },
    { id: 'm2', roomId: 'r1', authorId: 'u3', text: 'Hi there' },
    { id: 'm3', roomId: 'r2', authorId: 'u2', text: 'Lunch?' },
    { id: 'm4', roomId: 'r3', authorId: 'u3', text: 'Build is green' },
    { id: 'm5', roomId: 'r3', authorId: 'u1', text: 'Nice' },
  ]
  nextMessageId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listMembers(): Member[] {
  return members.slice()
}

export function listRooms(): Room[] {
  return rooms.slice()
}

export function listMessages(filter?: { roomId?: string | null }): Message[] {
  let out = messages.slice()
  const roomId = filter?.roomId
  if (roomId) out = out.filter((m) => m.roomId === roomId)
  return out
}

export function createMessage(input: { roomId: string; authorId: string; text: string }): Message {
  const message: Message = {
    id: `m${nextMessageId++}`,
    roomId: input.roomId,
    authorId: input.authorId,
    text: input.text,
  }
  messages.push(message)
  return message
}

export function findMessage(id: string): Message | undefined {
  return messages.find((m) => m.id === id)
}

export function updateMessage(id: string, text: string): Message | undefined {
  const message = messages.find((m) => m.id === id)
  if (!message) return undefined
  message.text = text
  return message
}

export function deleteMessage(id: string): boolean {
  const idx = messages.findIndex((m) => m.id === id)
  if (idx === -1) return false
  messages.splice(idx, 1)
  return true
}
