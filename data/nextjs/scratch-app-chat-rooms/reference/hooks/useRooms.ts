'use client'
import { useApp } from '../components/AppStateProvider'
import type { Message } from '../lib/types'

export type RoomStats = {
  totalRooms: number
  totalMessages: number
  totalUnread: number
}

export function messagesFor(messages: Message[], roomId: string): Message[] {
  return messages.filter((m) => m.roomId === roomId)
}

export function computeStats(
  roomCount: number,
  messages: Message[],
  unread: Record<string, number>,
): RoomStats {
  let totalUnread = 0
  Object.keys(unread).forEach((k) => {
    totalUnread += unread[k]
  })
  return {
    totalRooms: roomCount,
    totalMessages: messages.length,
    totalUnread,
  }
}

export function useRooms() {
  const { rooms, messages, unread } = useApp()
  const roomMessages = (roomId: string) => messagesFor(messages, roomId)
  const stats = computeStats(rooms.length, messages, unread)
  return { roomMessages, stats }
}
