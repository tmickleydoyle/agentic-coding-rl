'use client';
import React, { useState } from 'react';

export function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!body.trim()) { setError('Body is required'); return; }
    if (!author.trim()) { setError('Author is required'); return; }
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, author, tags: tagList }),
    });
    if (res.ok) {
      setTitle(''); setBody(''); setTags(''); setAuthor(''); setError(''); setSuccess(true);
    }
  }

  return (
    <div data-testid="new-article-page">
      <h1>New Article</h1>
      {success && <div data-testid="success-msg">Article created!</div>}
      <input data-testid="title-input" value={title} onChange={(e) => { setTitle(e.target.value); setSuccess(false); }} placeholder="Title" />
      <textarea data-testid="body-input" value={body} onChange={(e) => { setBody(e.target.value); setSuccess(false); }} placeholder="Body" />
      <input data-testid="tags-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
      <input data-testid="author-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      {error && <span data-testid="form-error">{error}</span>}
      <button data-testid="submit-btn" onClick={handleSubmit}>Create Article</button>
    </div>
  );
}
