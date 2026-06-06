'use client';
import React, { useEffect, useState } from 'react';
import { Thread } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function ProfilePage() {
  const { selectedUser } = useApp();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    fetch('/api/threads')
      .then((r) => r.json())
      .then(setThreads);
  }, []);

  const userThreads = threads.filter((t) => t.author === selectedUser);
  const replyCount = threads.reduce((sum, t) => sum + t.replies.filter((r) => r.author === selectedUser).length, 0);

  return (
    <div data-testid="profile-page">
      <h1 data-testid="profile-username">{selectedUser ?? 'No user selected'}</h1>
      <div data-testid="profile-reply-count">Replies: {replyCount}</div>
      <div data-testid="profile-threads">
        {userThreads.map((t) => (
          <div key={t.id} data-testid={`profile-thread-${t.id}`}>{t.title}</div>
        ))}
      </div>
    </div>
  );
}
