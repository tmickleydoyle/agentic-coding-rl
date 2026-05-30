'use client'
import { useApp } from '../components/AppStateProvider'
import type { Message } from '../lib/types'

export type RoomStats = {
  totalRooms: number
  totalMessages: number
  totalUnread: number
}

export function messagesFor(_messages: Message[], _roomId: string): Message[] {
  // TODO: return messages for the given room
  return []
}

export function computeStats(
  _roomCount: number,
  _messages: Message[],
  _unread: Record<string, number>,
): RoomStats {
  // TODO: total rooms, total messages, sum of unread counts
  return { totalRooms: 0, totalMessages: 0, totalUnread: 0 }
}

export function useRooms() {
  const { rooms, messages, unread } = useApp()
  const roomMessages = (roomId: string) => messagesFor(messages, roomId)
  const stats = computeStats(rooms.length, messages, unread)
  return { roomMessages, stats }
}
