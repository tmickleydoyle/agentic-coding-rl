'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Priority } from '../../lib/types';

export function BoardPage() {
  const { tasks, labels, addTask, moveForward } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState(labels[0]?.name ?? '');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!title.trim()) { setError('Title required'); return; }
    setError('');
    addTask({ title: title.trim(), description: description.trim(), status: 'todo', label, priority });
    setTitle(''); setDescription('');
  }

  const statuses: Array<{ key: 'todo' | 'inprogress' | 'done'; label: string }> = [
    { key: 'todo', label: 'Todo' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Board</h1>
      {error && <div data-testid="task-error" style={{ color: 'red' }}>{error}</div>}
      <div style={{ marginBottom: 16 }}>
        <input data-testid="task-title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input data-testid="task-description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <select data-testid="task-label" value={label} onChange={e => setLabel(e.target.value)}>
          {labels.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
        <select data-testid="task-priority" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button data-testid="add-task-btn" onClick={handleAdd}>Add Task</button>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {statuses.map(s => (
          <div key={s.key} style={{ flex: 1, background: '#f1f5f9', padding: 12, borderRadius: 4 }}>
            <h2>{s.label}</h2>
            {tasks.filter(t => t.status === s.key).map(t => (
              <div key={t.id} data-testid={`task-card-${t.id}`} style={{ background: '#fff', padding: 8, marginBottom: 8, borderRadius: 4 }}>
                <strong>{t.title}</strong>
                <div>{t.label} · {t.priority}</div>
                {s.key !== 'done' && (
                  <button data-testid={`move-forward-${t.id}`} onClick={() => moveForward(t.id)}>Move Forward</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
