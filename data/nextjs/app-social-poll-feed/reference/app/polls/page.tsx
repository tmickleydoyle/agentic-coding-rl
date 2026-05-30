'use client'
import { useApp } from '../../components/AppStateProvider'
import PollCard from '../../components/PollCard'

export default function PollsPage() {
  const { polls, openPoll } = useApp()
  return (
    <section data-testid="page-polls">
      <h1>Polls</h1>
      <ul data-testid="poll-list">
        {polls.map((p) => (
          <PollCard key={p.id} poll={p} onOpen={openPoll} />
        ))}
      </ul>
    </section>
  )
}
