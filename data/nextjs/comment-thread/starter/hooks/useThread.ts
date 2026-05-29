import { useState } from 'react'
import type { Comment } from '../components/types'

// TODO: return { comments, addReply, addRoot }. addRoot(text) appends a top-level comment
// (empty replies, unique id). addReply(parentId, text) recursively finds the comment with
// parentId and appends a reply to its replies. Ids must be unique across the whole tree
// (one greater than any existing id).
export function useThread(initial: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initial)
  return {
    comments,
    addReply: (_parentId: number, _text: string) => {},
    addRoot: (_text: string) => {},
  }
}
