'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ModulesPage() {
  const { modules, lessons, setModules, setLessons } = useApp();
  const [title, setTitle] = useState('');

  async function handleAdd() {
    if (!title.trim()) return;
    const res = await fetch('/api/courses?type=module', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
    if (res.ok) { const mod = await res.json(); setModules([...modules, mod]); setTitle(''); }
  }

  async function handleDelete(id: number) {
    const res = await fetch('/api/courses?type=module', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok || res.status === 204) {
      setModules(modules.filter((m) => m.id !== id));
      setLessons(lessons.filter((l) => l.moduleId !== id));
    }
  }

  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div data-testid="modules-page">
      <h2>Modules</h2>
      <ul data-testid="module-list">
        {sorted.map((m) => (
          <li key={m.id} data-testid={`module-${m.id}`}>
            <span data-testid={`module-title-${m.id}`}>{m.title}</span>
            <span data-testid={`module-order-${m.id}`}>Order: {m.order}</span>
            <button data-testid={`delete-module-${m.id}`} onClick={() => handleDelete(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-module-form">
        <input data-testid="module-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module title" />
        <button data-testid="add-module-btn" onClick={handleAdd}>Add Module</button>
      </div>
    </div>
  );
}
