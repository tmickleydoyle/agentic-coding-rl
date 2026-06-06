'use client';
import React, { useEffect, useState } from 'react';
import { Thread } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [replyError, setReplyError] = useState('');
  const { setSelectedUser, navigate } = useApp();

  useEffect(() => {
    fetch('/api/threads')
      .then((r) => r.json())
      .then(setThreads);
  }, []);

  function openThread(t: Thread) {
    setSelected(t);
    setReplyBody('');
    setReplyError('');
  }

  async function handleUpvote(id: string) {
    const res = await fetch(`/api/threads/${id}/upvote`, { method: 'POST' });
    const data = await res.json();
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, upvotes: data.upvotes } : t)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, upvotes: data.upvotes } : prev);
  }

  async function handleReply() {
    if (!replyBody.trim()) { setReplyError('Reply body is required'); return; }
    if (!selected) return;
    const res = await fetch(`/api/threads/${selected.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'guest', body: replyBody }),
    });
    const data = await res.json();
    setSelected((prev) => prev ? { ...prev, replies: [...prev.replies, data.reply] } : prev);
    setReplyBody('');
    setReplyError('');
  }

  if (selected) {
    return (
      <div data-testid="thread-detail">
        <button data-testid="back-btn" onClick={() => setSelected(null)}>Back</button>
        <h2 data-testid="thread-title">{selected.title}</h2>
        <p data-testid="thread-body">{selected.body}</p>
        <span data-testid="thread-author">{selected.author}</span>
        <button data-testid="upvote-thread-btn" onClick={() => handleUpvote(selected.id)}>
          Upvote ({selected.upvotes})
        </button>
        <div data-testid="replies-list">
          {selected.replies.map((r) => (
            <div key={r.id} data-testid={`reply-${r.id}`}>
              <span>{r.author}: {r.body}</span>
            </div>
          ))}
        </div>
        <textarea data-testid="reply-input" value={replyBody} onChange={(e) => setReplyBody(e.target.value)} placeholder="Write a reply..." />
        {replyError && <span data-testid="reply-error">{replyError}</span>}
        <button data-testid="reply-submit" onClick={handleReply}>Submit Reply</button>
      </div>
    );
  }

  return (
    <div data-testid="threads-page">
      <h1>Threads</h1>
      {threads.map((t) => (
        <div key={t.id} data-testid={`thread-row-${t.id}`}>
          <button data-testid={`thread-link-${t.id}`} onClick={() => openThread(t)}>{t.title}</button>
          <span data-testid={`category-badge-${t.id}`}>{t.category}</span>
          <span data-testid={`reply-count-${t.id}`}>{t.replies.length} replies</span>
          <span data-testid={`upvote-count-${t.id}`}>{t.upvotes}</span>
          <button data-testid={`author-link-${t.id}`} onClick={() => { setSelectedUser(t.author); navigate('profile'); }}>
            {t.author}
          </button>
        </div>
      ))}
    </div>
  );
}
