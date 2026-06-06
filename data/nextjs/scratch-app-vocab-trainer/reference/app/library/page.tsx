'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function LibraryPage() {
  const { words, addWord, deleteWord } = useApp();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  const categories = Array.from(new Set(words.map(w => w.category)));
  const displayed = filter === 'All' ? words : words.filter(w => w.category === filter);

  const handleAdd = () => {
    if (!term.trim() || !definition.trim()) { setError('Term and definition required'); return; }
    const ok = addWord(term, definition, category || 'general');
    if (!ok) { setError('Duplicate term'); return; }
    setTerm(''); setDefinition(''); setCategory(''); setError('');
  };

  return (
    <main data-testid="library-page">
      <h2>Word Library</h2>
      <div data-testid="add-word-form">
        <input data-testid="word-term-input" value={term} onChange={e => setTerm(e.target.value)} placeholder="Term" />
        <input data-testid="word-definition-input" value={definition} onChange={e => setDefinition(e.target.value)} placeholder="Definition" />
        <input data-testid="word-category-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <button data-testid="add-word-btn" onClick={handleAdd}>Add Word</button>
        {error && <span data-testid="word-error">{error}</span>}
      </div>
      <div data-testid="filter-section">
        <select data-testid="category-filter" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <ul data-testid="words-list">
        {displayed.map(w => (
          <li key={w.id} data-testid={`word-item-${w.id}`}>
            <span data-testid={`word-term-${w.id}`}>{w.term}</span>
            <span data-testid={`word-def-${w.id}`}>{w.definition}</span>
            <span data-testid={`word-cat-${w.id}`}>{w.category}</span>
            <button data-testid={`delete-word-${w.id}`} onClick={() => deleteWord(w.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
