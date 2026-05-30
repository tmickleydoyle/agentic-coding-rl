'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useSupport } from '../../hooks/useSupport'
import ReplyItem from '../../components/ReplyItem'

export default function ChatPage() {
  const { agents, chats, selectedChatId, sendReply, closeChat, reopenChat, assignAgent } = useApp()
  const { chatReplies } = useSupport()
  const [text, setText] = useState('')

  const chat = chats.find((c) => c.id === selectedChatId)
  if (!chat) {
    return (
      <section data-testid="page-chat">
        <p data-testid="no-chat-selected">No chat selected.</p>
      </section>
    )
  }

  const msgs = chatReplies(chat.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    sendReply(chat.id, text)
    setText('')
  }

  const onToggle = () => {
    if (chat.status === 'open') closeChat(chat.id)
    else reopenChat(chat.id)
  }

  return (
    <section data-testid="page-chat">
      <h1 data-testid="chat-title">{chat.customer}</h1>
      <span data-testid="chat-status">{chat.status}</span>
      <button data-testid="close-toggle" onClick={onToggle}>
        {chat.status === 'closed' ? 'Reopen' : 'Close'}
      </button>
      <select
        data-testid="assign-select"
        value={chat.agentId ?? ''}
        onChange={(e) => assignAgent(chat.id, e.target.value)}
      >
        <option value="">Unassigned</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <ul data-testid="reply-list">
        {msgs.map((r) => (
          <ReplyItem key={r.id} reply={r} />
        ))}
      </ul>
      <form data-testid="send-form" onSubmit={onSubmit}>
        <input data-testid="reply-input" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" data-testid="send-submit">
          Send
        </button>
      </form>
    </section>
  )
}
