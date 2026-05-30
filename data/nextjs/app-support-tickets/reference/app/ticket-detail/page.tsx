'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { TicketStatus } from '../../lib/types'

export default function TicketDetailPage() {
  const { tickets, selectedTicketId, assign, setStatus, reply } = useApp()
  const [assigneeInput, setAssigneeInput] = useState('')
  const [replyBody, setReplyBody] = useState('')

  const ticket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId)
    : undefined

  if (!ticket) {
    return (
      <section data-testid="page-ticket-detail">
        <p data-testid="no-selection">No ticket selected.</p>
      </section>
    )
  }

  const onAssign = () => {
    const trimmed = assigneeInput.trim()
    assign(ticket.id, trimmed.length > 0 ? trimmed : null)
    setAssigneeInput('')
  }

  const onReply = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = replyBody.trim()
    if (trimmed.length === 0) return
    reply(ticket.id, 'agent', trimmed)
    setReplyBody('')
  }

  return (
    <section data-testid="page-ticket-detail">
      <h1 data-testid="detail-subject">{ticket.subject}</h1>
      <p data-testid="detail-requester">{ticket.requester}</p>
      <p data-testid="detail-priority">{ticket.priority}</p>
      <p data-testid="detail-status">{ticket.status}</p>
      <p data-testid="detail-assignee">{ticket.assignee ?? 'Unassigned'}</p>

      <input
        data-testid="assignee-input"
        value={assigneeInput}
        onChange={(e) => setAssigneeInput(e.target.value)}
      />
      <button data-testid="assign-btn" onClick={onAssign}>
        Assign
      </button>

      <select
        data-testid="status-select"
        value={ticket.status}
        onChange={(e) => setStatus(ticket.id, e.target.value as TicketStatus)}
      >
        <option value="open">open</option>
        <option value="pending">pending</option>
        <option value="resolved">resolved</option>
      </select>

      <ul data-testid="transcript">
        {ticket.replies.map((r) => (
          <li key={r.id} data-testid={`reply-${r.id}`}>
            <span data-testid={`reply-${r.id}-author`}>{r.author}</span>
            <span data-testid={`reply-${r.id}-body`}>{r.body}</span>
          </li>
        ))}
      </ul>

      <form data-testid="reply-form" onSubmit={onReply}>
        <input
          data-testid="reply-input"
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
        />
        <button type="submit" data-testid="reply-btn">
          Reply
        </button>
      </form>
    </section>
  )
}
