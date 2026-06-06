'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Project } from '../../lib/types';

export function ProjectsPage() {
  const { clients, projects, setProjects, setInvoices } = useApp();
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [rate, setRate] = useState('');
  const [hours, setHours] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !clientId || Number(rate) <= 0) return;
    const p: Project = {
      id: `p${Date.now()}`,
      clientId,
      title: title.trim(),
      status: 'active',
      hourlyRate: Number(rate),
      hoursLogged: Number(hours) || 0,
    };
    setProjects(prev => [...prev, p]);
    setTitle(''); setClientId(''); setRate(''); setHours('');
  }

  function handleToggle(id: string) {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'completed' : 'active' } : p
    ));
  }

  function handleDelete(id: string) {
    setInvoices(prev => prev.filter(i => i.projectId !== id));
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div>
      <h2>Projects</h2>
      <form data-testid="project-add-form" onSubmit={handleAdd}>
        <input data-testid="project-title-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <select data-testid="project-client-select" value={clientId} onChange={e => setClientId(e.target.value)}>
          <option value="">Select client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input data-testid="project-rate-input" type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="Hourly rate" />
        <input data-testid="project-hours-input" type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="Hours logged" />
        <button data-testid="project-submit" type="submit">Add Project</button>
      </form>
      <ul data-testid="project-list">
        {projects.map(p => (
          <li key={p.id} data-testid="project-item">
            <span>{p.title}</span>
            <span>{p.status}</span>
            <button data-testid="project-status-toggle" onClick={() => handleToggle(p.id)}>Toggle</button>
            <button data-testid="project-delete" onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
