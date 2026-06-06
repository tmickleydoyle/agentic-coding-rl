'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Plant } from '../../lib/types';

export function PlantsPage() {
  const { plants, setPlants, beds, setBeds } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState<Plant['type']>('vegetable');
  const [sunlight, setSunlight] = useState<Plant['sunlight']>('full');
  const [watering, setWatering] = useState<Plant['wateringFrequency']>('weekly');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const p: Plant = { id: `pl${Date.now()}`, name: name.trim(), type, sunlight, wateringFrequency: watering };
    setPlants(prev => [...prev, p]);
    setName('');
  }

  function handleDelete(id: string) {
    setBeds(prev => prev.map(b => ({ ...b, plantIds: b.plantIds.filter(pid => pid !== id) })));
    setPlants(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div>
      <h2>Plants</h2>
      <form data-testid="plant-add-form" onSubmit={handleAdd}>
        <input data-testid="plant-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Plant name" />
        <select data-testid="plant-type-select" value={type} onChange={e => setType(e.target.value as Plant['type'])}>
          <option value="vegetable">vegetable</option>
          <option value="herb">herb</option>
          <option value="flower">flower</option>
          <option value="fruit">fruit</option>
        </select>
        <select data-testid="plant-sun-select" value={sunlight} onChange={e => setSunlight(e.target.value as Plant['sunlight'])}>
          <option value="full">full</option>
          <option value="partial">partial</option>
          <option value="shade">shade</option>
        </select>
        <select data-testid="plant-water-select" value={watering} onChange={e => setWatering(e.target.value as Plant['wateringFrequency'])}>
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="biweekly">biweekly</option>
        </select>
        <button data-testid="plant-submit" type="submit">Add Plant</button>
      </form>
      <ul data-testid="plant-list">
        {plants.map(p => (
          <li key={p.id} data-testid="plant-item">
            <span>{p.name}</span>
            <span>{p.type}</span>
            <button data-testid="plant-delete" onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
