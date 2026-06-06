'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Pet } from '../../lib/types';

export function PetsPage() {
  const { pets, setPets, setVisits, setMedications } = useApp();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Pet['species']>('dog');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const p: Pet = { id: `pt${Date.now()}`, name: name.trim(), species, birthDate, weight: Number(weight) || 0 };
    setPets(prev => [...prev, p]);
    setName(''); setBirthDate(''); setWeight('');
  }

  function handleDelete(id: string) {
    setVisits(prev => prev.filter(v => v.petId !== id));
    setMedications(prev => prev.filter(m => m.petId !== id));
    setPets(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div>
      <h2>Pets</h2>
      <form data-testid="pet-add-form" onSubmit={handleAdd}>
        <input data-testid="pet-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Pet name" />
        <select data-testid="pet-species-select" value={species} onChange={e => setSpecies(e.target.value as Pet['species'])}>
          <option value="dog">dog</option>
          <option value="cat">cat</option>
          <option value="bird">bird</option>
          <option value="rabbit">rabbit</option>
          <option value="other">other</option>
        </select>
        <input data-testid="pet-birth-input" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        <input data-testid="pet-weight-input" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight kg" />
        <button data-testid="pet-submit" type="submit">Add Pet</button>
      </form>
      <ul data-testid="pet-list">
        {pets.map(p => (
          <li key={p.id} data-testid="pet-item">
            <span>{p.name}</span>
            <span>{p.species}</span>
            <button data-testid="pet-delete" onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
