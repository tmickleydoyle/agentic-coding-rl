'use client';
import React, { useEffect, useState } from 'react';
import { Thread } from '../../lib/types';

export function HomePage() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    fetch('/api/threads')
      .then((r) => r.json())
      .then((data) => setThreads(data));
  }, []);

  const totalReplies = threads.reduce((sum, t) => sum + t.replies.length, 0);
  const authors = new Set<string>();
  threads.forEach((t) => {
    authors.add(t.author);
    t.replies.forEach((r) => authors.add(r.author));
  });

  return (
    <div data-testid="home-page">
      <h1>Forum</h1>
      <div data-testid="stat-threads">Threads: {threads.length}</div>
      <div data-testid="stat-replies">Replies: {totalReplies}</div>
      <div data-testid="stat-users">Active Users: {authors.size}</div>
    </div>
  );
}
