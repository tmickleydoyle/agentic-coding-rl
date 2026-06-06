'use client';
import React, { useEffect, useState } from 'react';
import { Poll } from '../../lib/types';

export function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    fetch('/api/polls').then((r) => r.json()).then(setPolls);
  }, []);

  const totalVotes = polls.reduce((s, p) => s + p.options.reduce((ss, o) => ss + o.votes, 0), 0);
  const mostVoted = polls.reduce<Poll | null>((best, p) => {
    const v = p.options.reduce((s, o) => s + o.votes, 0);
    const bv = best ? best.options.reduce((s, o) => s + o.votes, 0) : -1;
    return v > bv ? p : best;
  }, null);

  return (
    <div data-testid="home-page">
      <h1>Poll Station</h1>
      <div data-testid="stat-polls">Polls: {polls.length}</div>
      <div data-testid="stat-votes">Votes: {totalVotes}</div>
      <div data-testid="stat-top">{mostVoted ? mostVoted.question : 'None'}</div>
    </div>
  );
}
