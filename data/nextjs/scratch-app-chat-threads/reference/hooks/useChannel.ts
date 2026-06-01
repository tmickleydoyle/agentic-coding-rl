'use client'
import { useApp } from '../components/AppStateProvider'
import type { Message, Reply } from '../lib/types'

export type ChannelStats = {
  totalMessages: number
  openMessages: number
  totalReplies: number
}

export function repliesFor(replies: Reply[], messageId: string): Reply[] {
  return replies.filter((r) => r.messageId === messageId)
}

export function searchMessages(messages: Message[], query: string): Message[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return messages.slice()
  return messages.filter((m) => m.text.toLowerCase().includes(q))
}

export function computeStats(messages: Message[], replies: Reply[]): ChannelStats {
  let openMessages = 0
  messages.forEach((m) => {
    if (!m.resolved) openMessages += 1
  })
  return {
    totalMessages: messages.length,
    openMessages,
    totalReplies: replies.length,
  }
}

export function useChannel() {
  const { messages, replies, query } = useApp()
  const messageReplies = (messageId: string) => repliesFor(replies, messageId)
  const replyCount = (messageId: string) => repliesFor(replies, messageId).length
  const matchedMessages = searchMessages(messages, query)
  const stats = computeStats(messages, replies)
  return { messageReplies, replyCount, matchedMessages, stats }
}
