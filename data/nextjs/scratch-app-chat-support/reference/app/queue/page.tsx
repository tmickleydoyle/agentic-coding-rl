'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSupport } from '../../hooks/useSupport'
import ChatRow from '../../components/ChatRow'

export default function QueuePage() {
  const { openChat } = useApp()
  const { openChats } = useSupport()

  return (
    <section data-testid="page-queue">
      <h1>Queue</h1>
      <span data-testid="queue-count">{openChats.length}</span>
      <ul data-testid="queue-list">
        {openChats.map((c) => (
          <ChatRow key={c.id} chat={c} onOpen={openChat} />
        ))}
      </ul>
    </section>
  )
}
