'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ContactsPage() {
  const { contacts, groups, addContact, deleteContact } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState(groups[0]?.name ?? '');
  const [error, setError] = useState('');

  function handleAdd() {
    const err = addContact({ name: name.trim(), email: email.trim(), phone: phone.trim(), group });
    if (err) { setError(err); return; }
    setError('');
    setName(''); setEmail(''); setPhone('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Contacts</h1>
      {error && <div data-testid="contact-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="contact-name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input data-testid="contact-email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input data-testid="contact-phone" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <select data-testid="contact-group" value={group} onChange={e => setGroup(e.target.value)}>
          {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>
        <button data-testid="add-contact-btn" onClick={handleAdd}>Add</button>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Group</th><th></th></tr></thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id} data-testid={`contact-row-${c.id}`}>
              <td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.group}</td>
              <td><button data-testid={`delete-contact-${c.id}`} onClick={() => deleteContact(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
