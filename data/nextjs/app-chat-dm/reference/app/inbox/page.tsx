'use client'
import { useApp } from '../../components/AppStateProvider'
import { useInbox } from '../../hooks/useInbox'
import ThreadRow from '../../components/ThreadRow'

export default function InboxPage() {
  const { people, threads, openThread } = useApp()
  const { stats } = useInbox()

  const name = (id: string): string => people.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-inbox">
      <h1>Inbox</h1>
      <span data-testid="inbox-unread-count">{stats.unreadThreads}</span>
      <ul data-testid="thread-list">
        {threads.map((t) => (
          <ThreadRow key={t.id} thread={t} personName={name(t.personId)} onOpen={openThread} />
        ))}
      </ul>
    </section>
  )
}
