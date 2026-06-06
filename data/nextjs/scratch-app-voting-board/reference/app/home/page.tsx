'use client';
import React, { useEffect, useState } from 'react';
import { Proposal } from '../../lib/types';

export function HomePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch('/api/proposals').then((r) => r.json()).then(setProposals);
  }, []);

  const totalVotes = proposals.reduce((s, p) => s + p.upvotes + p.downvotes, 0);
  const top = proposals[0];

  return (
    <div data-testid="home-page">
      <h1>Voting Board</h1>
      <div data-testid="stat-proposals">Proposals: {proposals.length}</div>
      <div data-testid="stat-votes">Votes: {totalVotes}</div>
      <div data-testid="stat-top">{top ? top.title : 'None'}</div>
    </div>
  );
}
