'use client'
import { useApp } from '../components/AppStateProvider'
import type { Chat, Reply } from '../lib/types'

export type SupportStats = {
  totalChats: number
  openChats: number
  closedChats: number
}

export function repliesFor(replies: Reply[], chatId: string): Reply[] {
  return replies.filter((r) => r.chatId === chatId)
}

export function filterOpen(chats: Chat[]): Chat[] {
  return chats.filter((c) => c.status === 'open')
}

export function computeStats(chats: Chat[]): SupportStats {
  let openChats = 0
  let closedChats = 0
  chats.forEach((c) => {
    if (c.status === 'open') openChats += 1
    else closedChats += 1
  })
  return {
    totalChats: chats.length,
    openChats,
    closedChats,
  }
}

export function useSupport() {
  const { chats, replies } = useApp()
  const chatReplies = (chatId: string) => repliesFor(replies, chatId)
  const openChats = filterOpen(chats)
  const stats = computeStats(chats)
  return { chatReplies, openChats, stats }
}
