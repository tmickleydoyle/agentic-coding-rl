'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function NewThreadPage() {
  const { navigate } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!body.trim()) { setError('Body is required'); return; }
    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, author: 'guest', category }),
    });
    if (res.ok) {
      setTitle('');
      setBody('');
      setCategory('General');
      setError('');
      setSuccess(true);
    }
  }

  return (
    <div data-testid="new-thread-page">
      <h1>New Thread</h1>
      {success && <div data-testid="success-msg">Thread created!</div>}
      <input data-testid="title-input" value={title} onChange={(e) => { setTitle(e.target.value); setSuccess(false); }} placeholder="Title" />
      <textarea data-testid="body-input" value={body} onChange={(e) => { setBody(e.target.value); setSuccess(false); }} placeholder="Body" />
      <select data-testid="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="General">General</option>
        <option value="Tech">Tech</option>
        <option value="Off-Topic">Off-Topic</option>
      </select>
      {error && <span data-testid="form-error">{error}</span>}
      <button data-testid="submit-btn" onClick={handleSubmit}>Create Thread</button>
    </div>
  );
}
