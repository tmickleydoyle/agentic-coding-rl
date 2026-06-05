'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useChannel } from '../../hooks/useChannel'
import ReplyItem from '../../components/ReplyItem'

export default function ThreadPage() {
  const { members, messages, selectedMessageId, addReply, toggleResolved } = useApp()
  const { messageReplies } = useChannel()
  const [text, setText] = useState('')

  const message = messages.find((m) => m.id === selectedMessageId)
  if (!message) {
    return (
      <section data-testid="page-thread">
        <p data-testid="no-thread-selected">No thread selected.</p>
      </section>
    )
  }

  const handle = (id: string): string =>
    members.find((m) => m.id === id)?.handle ?? '@unknown'
  const replies = messageReplies(message.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    addReply(message.id, text)
    setText('')
  }

  return (
    <section data-testid="page-thread">
      <h1>Thread</h1>
      <p data-testid="thread-text">{message.text}</p>
      <span data-testid="thread-status">{message.resolved ? 'Resolved' : 'Open'}</span>
      <button data-testid="resolve-toggle" onClick={() => toggleResolved(message.id)}>
        {message.resolved ? 'Reopen' : 'Resolve'}
      </button>
      <ul data-testid="reply-list">
        {replies.map((r) => (
          <ReplyItem key={r.id} reply={r} authorHandle={handle(r.authorId)} />
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
