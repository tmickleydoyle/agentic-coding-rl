'use client';
import React, { useEffect, useState } from 'react';
import { Proposal } from '../../lib/types';

export function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch('/api/proposals').then((r) => r.json()).then(setProposals);
  }, []);

  async function handleUpvote(id: string) {
    const res = await fetch(`/api/proposals/${id}/upvote`, { method: 'POST' });
    const data = await res.json();
    if (data.score !== undefined) {
      setProposals((prev) => prev.map((p) => p.id === id ? { ...p, upvotes: data.upvotes, score: data.score } : p));
    }
  }

  async function handleDownvote(id: string) {
    const res = await fetch(`/api/proposals/${id}/downvote`, { method: 'POST' });
    const data = await res.json();
    if (data.score !== undefined) {
      setProposals((prev) => prev.map((p) => p.id === id ? { ...p, downvotes: data.downvotes } : p));
    }
  }

  return (
    <div data-testid="proposals-page">
      <h1>Proposals</h1>
      {proposals.map((p) => (
        <div key={p.id} data-testid={`proposal-row-${p.id}`}>
          <span data-testid={`proposal-title-${p.id}`}>{p.title}</span>
          <span data-testid={`score-${p.id}`}>{p.upvotes - p.downvotes}</span>
          <span data-testid={`proposal-status-${p.id}`}>{p.status}</span>
          <span data-testid={`proposal-category-${p.id}`}>{p.category}</span>
          {p.status === 'open' && (
            <>
              <button data-testid={`upvote-${p.id}`} onClick={() => handleUpvote(p.id)}>+</button>
              <button data-testid={`downvote-${p.id}`} onClick={() => handleDownvote(p.id)}>-</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
