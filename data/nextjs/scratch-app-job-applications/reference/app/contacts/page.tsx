'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Contact } from '../../lib/types';

export function ContactsPage() {
  const { applications, contacts, setContacts } = useApp();
  const [applicationId, setApplicationId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!applicationId || !name.trim()) return;
    const c: Contact = { id: `ct${Date.now()}`, applicationId, name: name.trim(), email: email.trim(), role: role.trim() };
    setContacts(prev => [...prev, c]);
    setApplicationId(''); setName(''); setEmail(''); setRole('');
  }

  return (
    <div>
      <h2>Contacts</h2>
      <form data-testid="contact-add-form" onSubmit={handleAdd}>
        <select data-testid="contact-app-select" value={applicationId} onChange={e => setApplicationId(e.target.value)}>
          <option value="">Select application</option>
          {applications.map(a => <option key={a.id} value={a.id}>{a.company}</option>)}
        </select>
        <input data-testid="contact-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="contact-email-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input data-testid="contact-role-input" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
        <button data-testid="contact-submit" type="submit">Add</button>
      </form>
      <ul data-testid="contact-list">
        {contacts.map(c => {
          const app = applications.find(a => a.id === c.applicationId);
          return (
            <li key={c.id} data-testid="contact-item">
              <span>{c.name}</span>
              <span>{app?.company ?? ''}</span>
              <button data-testid="contact-delete" onClick={() => setContacts(prev => prev.filter(x => x.id !== c.id))}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
