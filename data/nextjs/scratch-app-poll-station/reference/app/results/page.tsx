'use client';
import React, { useEffect, useState } from 'react';
import { Poll } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function ResultsPage() {
  const { selectedPollId } = useApp();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    if (selectedPollId) {
      fetch(`/api/polls/${selectedPollId}`).then((r) => r.json()).then((d) => setPoll(d.poll ?? null));
    }
  }, [selectedPollId]);

  async function handleVote(optionId: string) {
    if (!poll) return;
    const res = await fetch(`/api/polls/${poll.id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    const data = await res.json();
    if (data.poll) setPoll(data.poll);
  }

  if (!poll) return <div data-testid="results-page"><p>No poll selected.</p></div>;

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div data-testid="results-page">
      <h1 data-testid="poll-question">{poll.question}</h1>
      {poll.status === 'closed' && <span data-testid="closed-badge">Closed</span>}
      <div data-testid="options-list">
        {poll.options.map((o) => {
          const pct = totalVotes > 0 ? (o.votes / totalVotes * 100).toFixed(1) : 'N/A';
          return (
            <div key={o.id} data-testid={`option-${o.id}`}>
              <span data-testid={`option-text-${o.id}`}>{o.text}</span>
              <span data-testid={`option-votes-${o.id}`}>{o.votes}</span>
              <span data-testid={`option-pct-${o.id}`}>{pct}{totalVotes > 0 ? '%' : ''}</span>
              {poll.status === 'open' && (
                <button data-testid={`vote-btn-${o.id}`} onClick={() => handleVote(o.id)}>Vote</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
