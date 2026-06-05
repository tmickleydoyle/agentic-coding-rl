'use client'
import { useApp } from '../../components/AppStateProvider'
import OptionRow from '../../components/OptionRow'
import { percentages } from '../../lib/polls'

export default function PollPage() {
  const { polls, selectedPollId, vote } = useApp()

  const poll = polls.find((p) => p.id === selectedPollId)
  if (!poll) {
    return (
      <section data-testid="page-poll">
        <p data-testid="no-poll-selected">No poll selected.</p>
      </section>
    )
  }

  const voted = poll.votedOptionId !== null
  const pcts = percentages(poll)

  return (
    <section data-testid="page-poll">
      <h1 data-testid="detail-question">{poll.question}</h1>
      {voted ? <p data-testid="already-voted">You already voted.</p> : null}
      <ul data-testid="option-list">
        {poll.options.map((o) => (
          <OptionRow
            key={o.id}
            option={o}
            pct={pcts[o.id] ?? 0}
            disabled={voted}
            onVote={(optionId) => vote(poll.id, optionId)}
          />
        ))}
      </ul>
    </section>
  )
}
