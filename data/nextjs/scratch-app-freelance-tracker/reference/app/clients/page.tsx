'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Client } from '../../lib/types';

export function ClientsPage() {
  const { clients, setClients, projects, setProjects, invoices, setInvoices } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
    };
    setClients(prev => [...prev, newClient]);
    setName(''); setEmail(''); setCompany('');
  }

  function handleDelete(id: string) {
    const projectIds = projects.filter(p => p.clientId === id).map(p => p.id);
    setInvoices(prev => prev.filter(i => !projectIds.includes(i.projectId)));
    setProjects(prev => prev.filter(p => p.clientId !== id));
    setClients(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div>
      <h2>Clients</h2>
      <form data-testid="client-add-form" onSubmit={handleAdd}>
        <input data-testid="client-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="client-email-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" />
        <button data-testid="client-submit" type="submit">Add Client</button>
      </form>
      <ul data-testid="client-list">
        {clients.map(c => (
          <li key={c.id} data-testid="client-item">
            <span>{c.name}</span>
            <span>{c.email}</span>
            <span>{c.company}</span>
            <button data-testid="client-delete" onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
