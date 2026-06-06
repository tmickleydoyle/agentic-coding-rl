'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Application, AppStatus } from '../../lib/types';

export function ApplicationsPage() {
  const { applications, setApplications, contacts, setContacts, notes, setNotes } = useApp();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');

  const sorted = [...applications].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !date) return;
    const a: Application = { id: `a${Date.now()}`, company: company.trim(), role: role.trim(), status: 'applied', appliedDate: date, url: url.trim() };
    setApplications(prev => [...prev, a]);
    setCompany(''); setRole(''); setDate(''); setUrl('');
  }

  function handleStatus(id: string, status: AppStatus) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function handleDelete(id: string) {
    setContacts(prev => prev.filter(c => c.applicationId !== id));
    setNotes(prev => prev.filter(n => n.applicationId !== id));
    setApplications(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div>
      <h2>Applications</h2>
      <form data-testid="app-add-form" onSubmit={handleAdd}>
        <input data-testid="app-company-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" />
        <input data-testid="app-role-input" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
        <input data-testid="app-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="app-url-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" />
        <button data-testid="app-submit" type="submit">Add</button>
      </form>
      <ul data-testid="app-list">
        {sorted.map(a => (
          <li key={a.id} data-testid="app-item">
            <span>{a.company}</span>
            <span>{a.role}</span>
            <select data-testid="app-status-select" value={a.status} onChange={e => handleStatus(a.id, e.target.value as AppStatus)}>
              <option value="applied">applied</option>
              <option value="interview">interview</option>
              <option value="offer">offer</option>
              <option value="rejected">rejected</option>
            </select>
            <button data-testid="app-delete" onClick={() => handleDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
