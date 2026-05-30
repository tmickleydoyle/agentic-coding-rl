'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import ReplyItem from '../../components/ReplyItem'

export default function ThreadPage() {
  const { threads, replies, selectedThreadId, upvoteThread, addReply, upvoteReply } = useApp()
  const [text, setText] = useState('')

  const thread = threads.find((t) => t.id === selectedThreadId)
  if (!thread) {
    return (
      <section data-testid="page-thread">
        <p data-testid="no-thread-selected">No thread selected.</p>
      </section>
    )
  }

  const threadReplies = replies.filter((r) => r.threadId === thread.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    addReply(thread.id, text)
    setText('')
  }

  return (
    <section data-testid="page-thread">
      <h1 data-testid="detail-title">{thread.title}</h1>
      <span data-testid="detail-votes">{thread.votes}</span>
      <button data-testid="detail-upvote" onClick={() => upvoteThread(thread.id)}>
        Upvote
      </button>
      <ul data-testid="reply-list">
        {threadReplies.map((r) => (
          <ReplyItem key={r.id} reply={r} onUpvote={upvoteReply} />
        ))}
      </ul>
      <form data-testid="reply-form" onSubmit={onSubmit}>
        <input data-testid="reply-input" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" data-testid="reply-submit">
          Reply
        </button>
      </form>
    </section>
  )
}
