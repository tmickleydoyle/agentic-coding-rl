'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { AGENTS } from '../../lib/types'

export default function SessionPage() {
  const { sessions, selectedSessionId, assign, close, sendMessage } = useApp()
  const [agentChoice, setAgentChoice] = useState(AGENTS[0])
  const [text, setText] = useState('')

  const session = selectedSessionId
    ? sessions.find((s) => s.id === selectedSessionId)
    : undefined

  if (!session) {
    return (
      <section data-testid="page-session">
        <p data-testid="no-selection">No session selected.</p>
      </section>
    )
  }

  const onSend = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length === 0) return
    sendMessage(session.id, 'agent', trimmed)
    setText('')
  }

  return (
    <section data-testid="page-session" data-status={session.status}>
      <h1 data-testid="detail-visitor">{session.visitor}</h1>
      <p data-testid="detail-topic">{session.topic}</p>
      <p data-testid="detail-status">{session.status}</p>
      <p data-testid="detail-agent">{session.agent ?? 'Unassigned'}</p>

      <select
        data-testid="agent-select"
        value={agentChoice}
        onChange={(e) => setAgentChoice(e.target.value)}
      >
        {AGENTS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <button data-testid="assign-btn" onClick={() => assign(session.id, agentChoice)}>
        Assign
      </button>
      <button data-testid="close-btn" onClick={() => close(session.id)}>
        Close
      </button>

      <ul data-testid="transcript">
        {session.messages.map((m) => (
          <li key={m.id} data-testid={`message-${m.id}`} data-from={m.from}>
            <span data-testid={`message-${m.id}-text`}>{m.text}</span>
          </li>
        ))}
      </ul>

      <form data-testid="message-form" onSubmit={onSend}>
        <input
          data-testid="message-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" data-testid="send-btn">
          Send
        </button>
      </form>
    </section>
  )
}
