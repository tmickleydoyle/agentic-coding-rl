'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useInbox } from '../../hooks/useInbox'
import DMItem from '../../components/DMItem'

export default function ThreadPage() {
  const { people, threads, selectedThreadId, sendDM, markUnread } = useApp()
  const { threadDMs } = useInbox()
  const [text, setText] = useState('')

  const thread = threads.find((t) => t.id === selectedThreadId)
  if (!thread) {
    return (
      <section data-testid="page-thread">
        <p data-testid="no-thread-selected">No thread selected.</p>
      </section>
    )
  }

  const personName = people.find((p) => p.id === thread.personId)?.name ?? 'Unknown'
  const handle = (id: string): string =>
    people.find((p) => p.id === id)?.handle ?? '@unknown'
  const msgs = threadDMs(thread.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    sendDM(thread.id, text)
    setText('')
  }

  return (
    <section data-testid="page-thread">
      <h1 data-testid="thread-title">{personName}</h1>
      <button data-testid="mark-unread" onClick={() => markUnread(thread.id)}>
        Mark unread
      </button>
      <ul data-testid="dm-list">
        {msgs.map((d) => (
          <DMItem key={d.id} dm={d} authorHandle={handle(d.authorId)} />
        ))}
      </ul>
      <form data-testid="send-form" onSubmit={onSubmit}>
        <input data-testid="dm-input" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" data-testid="send-submit">
          Send
        </button>
      </form>
    </section>
  )
}
