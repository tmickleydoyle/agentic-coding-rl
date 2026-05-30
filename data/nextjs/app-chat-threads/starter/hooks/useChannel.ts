'use client'
import { useApp } from '../components/AppStateProvider'
import type { Message, Reply } from '../lib/types'

export type ChannelStats = {
  totalMessages: number
  openMessages: number
  totalReplies: number
}

export function repliesFor(_replies: Reply[], _messageId: string): Reply[] {
  // TODO: return replies for the given message
  return []
}

export function searchMessages(_messages: Message[], _query: string): Message[] {
  // TODO: messages whose text matches the query (case-insensitive)
  return []
}

export function computeStats(_messages: Message[], _replies: Reply[]): ChannelStats {
  // TODO: total messages, unresolved (open) count, total replies
  return { totalMessages: 0, openMessages: 0, totalReplies: 0 }
}

export function useChannel() {
  const { messages, replies, query } = useApp()
  const messageReplies = (messageId: string) => repliesFor(replies, messageId)
  const replyCount = (messageId: string) => repliesFor(replies, messageId).length
  const matchedMessages = searchMessages(messages, query)
  const stats = computeStats(messages, replies)
  return { messageReplies, replyCount, matchedMessages, stats }
}
