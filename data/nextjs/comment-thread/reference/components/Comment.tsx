'use client'
import { useState } from 'react'
import type { Comment as CommentType } from './types'

export default function Comment({
  comment,
  onReply,
}: {
  comment: CommentType
  onReply: (parentId: number, text: string) => void
}) {
  const [draft, setDraft] = useState('')

  const submit = () => {
    const text = draft.trim()
    if (!text) return
    onReply(comment.id, text)
    setDraft('')
  }

  return (
    <li data-testid={`comment-${comment.id}`}>
      <span data-testid={`text-${comment.id}`}>{comment.text}</span>
      <div>
        <input
          data-testid={`reply-input-${comment.id}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button data-testid={`reply-btn-${comment.id}`} onClick={submit}>
          Reply
        </button>
      </div>
      {comment.replies.length > 0 && (
        <ul data-testid={`replies-${comment.id}`}>
          {comment.replies.map((r) => (
            <Comment key={r.id} comment={r} onReply={onReply} />
          ))}
        </ul>
      )}
    </li>
  )
}
