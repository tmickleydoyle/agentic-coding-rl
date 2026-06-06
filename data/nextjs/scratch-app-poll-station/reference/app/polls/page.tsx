'use client';
import React, { useEffect, useState } from 'react';
import { Poll } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const { navigate, setSelectedPollId } = useApp();

  useEffect(() => {
    fetch('/api/polls').then((r) => r.json()).then(setPolls);
  }, []);

  return (
    <div data-testid="polls-page">
      <h1>Polls</h1>
      {polls.map((p) => {
        const totalVotes = p.options.reduce((s, o) => s + o.votes, 0);
        return (
          <div key={p.id} data-testid={`poll-row-${p.id}`}>
            <button data-testid={`poll-link-${p.id}`} onClick={() => { setSelectedPollId(p.id); navigate('results'); }}>
              {p.question}
            </button>
            <span data-testid={`poll-status-${p.id}`}>{p.status}</span>
            <span data-testid={`poll-votes-${p.id}`}>{totalVotes}</span>
            <span data-testid={`poll-creator-${p.id}`}>{p.creator}</span>
          </div>
        );
      })}
    </div>
  );
}
