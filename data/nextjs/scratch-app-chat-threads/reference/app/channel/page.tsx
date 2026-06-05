'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useChannel } from '../../hooks/useChannel'
import MessageCard from '../../components/MessageCard'

export default function ChannelPage() {
  const { members, messages, postMessage, openThread } = useApp()
  const { replyCount } = useChannel()
  const [text, setText] = useState('')

  const handle = (id: string): string =>
    members.find((m) => m.id === id)?.handle ?? '@unknown'

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    postMessage(text)
    setText('')
  }

  return (
    <section data-testid="page-channel">
      <h1>Channel</h1>
      <form data-testid="post-form" onSubmit={onSubmit}>
        <input data-testid="post-input" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" data-testid="post-submit">
          Post
        </button>
      </form>
      <ul data-testid="message-list">
        {messages.map((m) => (
          <MessageCard
            key={m.id}
            message={m}
            authorHandle={handle(m.authorId)}
            replyCount={replyCount(m.id)}
            onOpen={openThread}
          />
        ))}
      </ul>
    </section>
  )
}
