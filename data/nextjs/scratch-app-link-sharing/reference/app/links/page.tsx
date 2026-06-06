'use client';
import React, { useEffect, useState } from 'react';
import { Link } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [selected, setSelected] = useState<Link | null>(null);
  const [commentBody, setCommentBody] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('guest');
  const [commentError, setCommentError] = useState('');
  const { navigate, setSelectedUser } = useApp();

  useEffect(() => {
    fetch('/api/links').then((r) => r.json()).then(setLinks);
  }, []);

  async function handleUpvote(id: string) {
    const res = await fetch(`/api/links/${id}/upvote`, { method: 'POST' });
    const data = await res.json();
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, upvotes: data.upvotes } : l));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, upvotes: data.upvotes } : prev);
  }

  async function handleComment() {
    if (!commentBody.trim()) { setCommentError('Comment body is required'); return; }
    if (!selected) return;
    const res = await fetch(`/api/links/${selected.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: commentAuthor, body: commentBody }),
    });
    const data = await res.json();
    setSelected((prev) => prev ? { ...prev, comments: [...prev.comments, data.comment] } : prev);
    setCommentBody('');
    setCommentError('');
  }

  if (selected) {
    return (
      <div data-testid="link-detail">
        <button data-testid="back-btn" onClick={() => setSelected(null)}>Back</button>
        <h2 data-testid="link-title">{selected.title}</h2>
        <a data-testid="link-url" href={selected.url}>{selected.url}</a>
        <button data-testid="upvote-btn" onClick={() => handleUpvote(selected.id)}>Upvote ({selected.upvotes})</button>
        <div data-testid="comments-list">
          {selected.comments.map((c) => (
            <div key={c.id} data-testid={`comment-${c.id}`}>
              <span>{c.author}: {c.body}</span>
            </div>
          ))}
        </div>
        <input data-testid="comment-author" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="Your name" />
        <input data-testid="comment-input" value={commentBody} onChange={(e) => { setCommentBody(e.target.value); setCommentError(''); }} placeholder="Comment..." />
        {commentError && <span data-testid="comment-error">{commentError}</span>}
        <button data-testid="comment-submit" onClick={handleComment}>Add Comment</button>
      </div>
    );
  }

  return (
    <div data-testid="links-page">
      <h1>Links</h1>
      {links.map((l, i) => (
        <div key={l.id} data-testid={`link-row-${l.id}`}>
          <span data-testid={`rank-${l.id}`}>{i + 1}</span>
          <button data-testid={`link-title-${l.id}`} onClick={() => setSelected(l)}>{l.title}</button>
          <span data-testid={`link-category-${l.id}`}>{l.category}</span>
          <span data-testid={`link-upvotes-${l.id}`}>{l.upvotes}</span>
          <span data-testid={`link-comments-${l.id}`}>{l.comments.length}</span>
          <button data-testid={`link-submitter-${l.id}`} onClick={() => { setSelectedUser(l.submitter); navigate('profile'); }}>
            {l.submitter}
          </button>
        </div>
      ))}
    </div>
  );
}
