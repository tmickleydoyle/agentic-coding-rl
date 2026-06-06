'use client';
import React, { useState } from 'react';

export function SubmitPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Feature');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    if (!author.trim()) { setError('Author is required'); return; }
    const res = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, author, category }),
    });
    if (res.ok) {
      setTitle(''); setDescription(''); setAuthor(''); setCategory('Feature'); setError(''); setSuccess(true);
    }
  }

  return (
    <div data-testid="submit-page">
      <h1>Submit Proposal</h1>
      {success && <div data-testid="success-msg">Proposal submitted!</div>}
      <input data-testid="title-input" value={title} onChange={(e) => { setTitle(e.target.value); setSuccess(false); }} placeholder="Title" />
      <textarea data-testid="description-input" value={description} onChange={(e) => { setDescription(e.target.value); setSuccess(false); }} placeholder="Description" />
      <input data-testid="author-input" value={author} onChange={(e) => { setAuthor(e.target.value); setSuccess(false); }} placeholder="Author" />
      <select data-testid="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Feature">Feature</option>
        <option value="Bug Fix">Bug Fix</option>
        <option value="Improvement">Improvement</option>
        <option value="Other">Other</option>
      </select>
      {error && <span data-testid="form-error">{error}</span>}
      <button data-testid="submit-btn" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
