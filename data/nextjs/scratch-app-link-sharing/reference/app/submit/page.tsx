'use client';
import React, { useState } from 'react';

export function SubmitPage() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Tech');
  const [submitter, setSubmitter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!url.trim()) { setError('URL is required'); return; }
    if (!submitter.trim()) { setError('Submitter is required'); return; }
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, submitter, category }),
    });
    if (res.ok) {
      setTitle(''); setUrl(''); setSubmitter(''); setCategory('Tech'); setError(''); setSuccess(true);
    }
  }

  return (
    <div data-testid="submit-page">
      <h1>Submit Link</h1>
      {success && <div data-testid="success-msg">Link submitted!</div>}
      <input data-testid="title-input" value={title} onChange={(e) => { setTitle(e.target.value); setSuccess(false); }} placeholder="Title" />
      <input data-testid="url-input" value={url} onChange={(e) => { setUrl(e.target.value); setSuccess(false); }} placeholder="URL" />
      <select data-testid="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="News">News</option>
        <option value="Tech">Tech</option>
        <option value="Fun">Fun</option>
        <option value="Other">Other</option>
      </select>
      <input data-testid="submitter-input" value={submitter} onChange={(e) => { setSubmitter(e.target.value); setSuccess(false); }} placeholder="Your name" />
      {error && <span data-testid="form-error">{error}</span>}
      <button data-testid="submit-btn" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
