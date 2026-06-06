'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Visit } from '../../lib/types';

export function VisitsPage() {
  const { pets, visits, setVisits } = useApp();
  const [petId, setPetId] = useState('');
  const [vetName, setVetName] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!petId || !vetName.trim() || !date) return;
    const v: Visit = { id: `v${Date.now()}`, petId, vetName: vetName.trim(), date, reason: reason.trim(), notes: notes.trim() };
    setVisits(prev => [...prev, v]);
    setPetId(''); setVetName(''); setDate(''); setReason(''); setNotes('');
  }

  return (
    <div>
      <h2>Vet Visits</h2>
      <form data-testid="visit-add-form" onSubmit={handleAdd}>
        <select data-testid="visit-pet-select" value={petId} onChange={e => setPetId(e.target.value)}>
          <option value="">Select pet</option>
          {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="visit-vet-input" value={vetName} onChange={e => setVetName(e.target.value)} placeholder="Vet name" />
        <input data-testid="visit-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="visit-reason-input" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" />
        <input data-testid="visit-notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="visit-submit" type="submit">Add Visit</button>
      </form>
      <ul data-testid="visit-list">
        {visits.map(v => (
          <li key={v.id} data-testid="visit-item">
            <span>{v.vetName}</span>
            <span>{v.date}</span>
            <span>{v.reason}</span>
            <button data-testid="visit-delete" onClick={() => setVisits(prev => prev.filter(x => x.id !== v.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
