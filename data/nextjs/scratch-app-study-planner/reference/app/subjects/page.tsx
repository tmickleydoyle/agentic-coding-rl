'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SubjectsPage() {
  const { subjects, addSubject, deleteSubject } = useApp();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Name is required'); return; }
    const ok = addSubject(name, color);
    if (!ok) { setError('Subject already exists'); return; }
    setName('');
    setError('');
  };

  return (
    <main data-testid="subjects-page">
      <h2>Subjects</h2>
      <div data-testid="add-subject-form">
        <input
          data-testid="subject-name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Subject name"
        />
        <input
          data-testid="subject-color-input"
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
        <button data-testid="add-subject-btn" onClick={handleAdd}>Add Subject</button>
        {error && <span data-testid="subject-error">{error}</span>}
      </div>
      <ul data-testid="subjects-list">
        {subjects.map(s => (
          <li key={s.id} data-testid={`subject-item-${s.id}`}>
            <span data-testid={`subject-name-${s.id}`}>{s.name}</span>
            <span
              data-testid={`subject-color-${s.id}`}
              style={{ background: s.color, display: 'inline-block', width: 16, height: 16 }}
            />
            <button data-testid={`delete-subject-${s.id}`} onClick={() => deleteSubject(s.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
