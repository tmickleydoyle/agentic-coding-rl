'use client'
import { useState } from 'react'
import type { Comment as CommentType } from './types'
import { useThread } from '../hooks/useThread'
import Comment from './Comment'

export default function Thread({ initial = [] }: { initial?: CommentType[] }) {
  const { comments, addReply, addRoot } = useThread(initial)
  const [draft, setDraft] = useState('')

  const submit = () => {
    const text = draft.trim()
    if (!text) return
    addRoot(text)
    setDraft('')
  }

  return (
    <div>
      <ul data-testid="thread">
        {comments.map((c) => (
          <Comment key={c.id} comment={c} onReply={addReply} />
        ))}
      </ul>
      <input
        data-testid="root-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button data-testid="root-btn" onClick={submit}>
        Add
      </button>
    </div>
  )
}
