'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Bed } from '../../lib/types';

export function BedsPage() {
  const { plants, beds, setBeds, setLog } = useApp();
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [selectedPlants, setSelectedPlants] = useState<Record<string, string>>({});

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || Number(size) <= 0) return;
    const b: Bed = { id: `b${Date.now()}`, name: name.trim(), sizesqft: Number(size), plantIds: [] };
    setBeds(prev => [...prev, b]);
    setName(''); setSize('');
  }

  function handleAssign(bedId: string) {
    const plantId = selectedPlants[bedId];
    if (!plantId) return;
    setBeds(prev => prev.map(b => b.id === bedId && !b.plantIds.includes(plantId) ? { ...b, plantIds: [...b.plantIds, plantId] } : b));
  }

  function handleDelete(id: string) {
    setLog(prev => prev.filter(e => e.bedId !== id));
    setBeds(prev => prev.filter(b => b.id !== id));
  }

  return (
    <div>
      <h2>Beds</h2>
      <form data-testid="bed-add-form" onSubmit={handleAdd}>
        <input data-testid="bed-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Bed name" />
        <input data-testid="bed-size-input" type="number" value={size} onChange={e => setSize(e.target.value)} placeholder="Size sqft" />
        <button data-testid="bed-submit" type="submit">Add Bed</button>
      </form>
      <ul data-testid="bed-list">
        {beds.map(b => (
          <li key={b.id} data-testid="bed-item">
            <span>{b.name}</span>
            <span data-testid="bed-plant-count">{b.plantIds.length}</span>
            <select data-testid="bed-plant-select" value={selectedPlants[b.id] || ''} onChange={e => setSelectedPlants(prev => ({ ...prev, [b.id]: e.target.value }))}>
              <option value="">Select plant</option>
              {plants.filter(p => !b.plantIds.includes(p.id)).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button data-testid="bed-assign-btn" onClick={() => handleAssign(b.id)}>Assign</button>
            <button data-testid="bed-delete" onClick={() => handleDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
