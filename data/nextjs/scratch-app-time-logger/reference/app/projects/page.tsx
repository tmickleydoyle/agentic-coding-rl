'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ProjectsPage() {
  const { projects, entries, addProject } = useApp();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6b7280');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!name.trim()) { setError('Name required'); return; }
    const result = addProject({ name: name.trim(), color });
    if (!result) { setError('Project already exists'); return; }
    setError(''); setName(''); setColor('#6b7280');
  }

  function hoursForProject(pid: string) {
    return entries.filter(e => e.projectId === pid).reduce((s, e) => s + e.hours, 0);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Projects</h1>
      {error && <div data-testid="project-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="project-name" placeholder="Project name" value={name} onChange={e => setName(e.target.value)} />
        <input data-testid="project-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        <button data-testid="add-project-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {projects.map(p => (
          <li key={p.id} data-testid={`project-row-${p.id}`}>
            {p.name} — {hoursForProject(p.id).toFixed(1)}h
          </li>
        ))}
      </ul>
    </div>
  );
}
