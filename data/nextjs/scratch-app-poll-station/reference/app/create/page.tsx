'use client';
import React, { useState } from 'react';

export function CreatePage() {
  const [question, setQuestion] = useState('');
  const [creator, setCreator] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function addOption() { setOptions((prev) => [...prev, '']); }

  function setOption(i: number, val: string) {
    setOptions((prev) => { const next = [...prev]; next[i] = val; return next; });
  }

  async function handleSubmit() {
    if (!question.trim()) { setError('Question is required'); return; }
    if (!creator.trim()) { setError('Creator is required'); return; }
    const filtered = options.filter((o) => o.trim());
    if (filtered.length < 2) { setError('At least 2 options required'); return; }
    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, creator, options: filtered }),
    });
    if (res.ok) {
      setQuestion(''); setCreator(''); setOptions(['', '']); setError(''); setSuccess(true);
    }
  }

  return (
    <div data-testid="create-page">
      <h1>Create Poll</h1>
      {success && <div data-testid="success-msg">Poll created!</div>}
      <input data-testid="question-input" value={question} onChange={(e) => { setQuestion(e.target.value); setSuccess(false); }} placeholder="Question" />
      <input data-testid="creator-input" value={creator} onChange={(e) => { setCreator(e.target.value); setSuccess(false); }} placeholder="Creator" />
      {options.map((opt, i) => (
        <input key={i} data-testid={`option-input-${i}`} value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
      ))}
      <button data-testid="add-option-btn" onClick={addOption}>Add Option</button>
      {error && <span data-testid="form-error">{error}</span>}
      <button data-testid="submit-btn" onClick={handleSubmit}>Create Poll</button>
    </div>
  );
}
