'use client';
import React, { useEffect, useState } from 'react';
import { Proposal } from '../../lib/types';

export function LeaderboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch('/api/proposals').then((r) => r.json()).then(setProposals);
  }, []);

  const top5 = proposals.slice(0, 5);

  return (
    <div data-testid="leaderboard-page">
      <h1>Leaderboard</h1>
      {top5.map((p, i) => (
        <div key={p.id} data-testid={`lb-row-${p.id}`}>
          <span data-testid={`lb-rank-${p.id}`}>{i + 1}</span>
          <span data-testid={`lb-title-${p.id}`}>{p.title}</span>
          <span data-testid={`lb-author-${p.id}`}>{p.author}</span>
          <span data-testid={`lb-score-${p.id}`}>{p.upvotes - p.downvotes}</span>
        </div>
      ))}
    </div>
  );
}
