'use client'
import { useState } from 'react'
import type { Comment as CommentType } from './types'

// TODO: render <li data-testid="comment-<id>"> with <span data-testid="text-<id>">, a reply
// form (<input data-testid="reply-input-<id>"> + <button data-testid="reply-btn-<id>">Reply</button>),
// and if there are replies a nested <ul data-testid="replies-<id>"> rendering each reply via Comment
// recursively. Reply with non-empty (trimmed) input calls onReply(comment.id, text) and clears it.
export default function Comment({
  comment,
  onReply,
}: {
  comment: CommentType
  onReply: (parentId: number, text: string) => void
}) {
  return (
    <li data-testid={`comment-${comment.id}`}>
      <span data-testid={`text-${comment.id}`}>{comment.text}</span>
    </li>
  )
}
