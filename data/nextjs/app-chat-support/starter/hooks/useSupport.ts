'use client'
import { useApp } from '../components/AppStateProvider'
import type { Chat, Reply } from '../lib/types'

export type SupportStats = {
  totalChats: number
  openChats: number
  closedChats: number
}

export function repliesFor(_replies: Reply[], _chatId: string): Reply[] {
  // TODO: return replies for the given chat
  return []
}

export function filterOpen(_chats: Chat[]): Chat[] {
  // TODO: return chats whose status is open
  return []
}

export function computeStats(_chats: Chat[]): SupportStats {
  // TODO: total chats, open count, closed count
  return { totalChats: 0, openChats: 0, closedChats: 0 }
}

export function useSupport() {
  const { chats, replies } = useApp()
  const chatReplies = (chatId: string) => repliesFor(replies, chatId)
  const openChats = filterOpen(chats)
  const stats = computeStats(chats)
  return { chatReplies, openChats, stats }
}
