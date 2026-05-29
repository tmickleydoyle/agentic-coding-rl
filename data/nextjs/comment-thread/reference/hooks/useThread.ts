import { useState } from 'react'
import type { Comment } from '../components/types'

function maxId(comments: Comment[]): number {
  let m = 0
  for (const c of comments) {
    m = Math.max(m, c.id, maxId(c.replies))
  }
  return m
}

function insertReply(comments: Comment[], parentId: number, child: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...c.replies, child] }
    }
    return { ...c, replies: insertReply(c.replies, parentId, child) }
  })
}

export function useThread(initial: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initial)

  const addRoot = (text: string) => {
    setComments((prev) => {
      const id = maxId(prev) + 1
      return [...prev, { id, text, replies: [] }]
    })
  }

  const addReply = (parentId: number, text: string) => {
    setComments((prev) => {
      const id = maxId(prev) + 1
      return insertReply(prev, parentId, { id, text, replies: [] })
    })
  }

  return { comments, addReply, addRoot }
}
