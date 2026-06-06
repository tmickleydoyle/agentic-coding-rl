'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Medication } from '../../lib/types';

export function MedicationsPage() {
  const { pets, medications, setMedications } = useApp();
  const [petId, setPetId] = useState('');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<Medication['frequency']>('daily');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!petId || !name.trim() || !dosage.trim()) return;
    const m: Medication = { id: `m${Date.now()}`, petId, name: name.trim(), dosage: dosage.trim(), frequency, active: true };
    setMedications(prev => [...prev, m]);
    setPetId(''); setName(''); setDosage('');
  }

  function handleToggle(id: string) {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  }

  return (
    <div>
      <h2>Medications</h2>
      <form data-testid="med-add-form" onSubmit={handleAdd}>
        <select data-testid="med-pet-select" value={petId} onChange={e => setPetId(e.target.value)}>
          <option value="">Select pet</option>
          {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="med-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Medication name" />
        <input data-testid="med-dosage-input" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Dosage" />
        <select data-testid="med-freq-select" value={frequency} onChange={e => setFrequency(e.target.value as Medication['frequency'])}>
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
        </select>
        <button data-testid="med-submit" type="submit">Add</button>
      </form>
      <ul data-testid="med-list">
        {medications.map(m => (
          <li key={m.id} data-testid="med-item">
            <span>{m.name}</span>
            <span>{m.active ? 'active' : 'inactive'}</span>
            <button data-testid="med-toggle" onClick={() => handleToggle(m.id)}>Toggle</button>
            <button data-testid="med-delete" onClick={() => setMedications(prev => prev.filter(x => x.id !== m.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
