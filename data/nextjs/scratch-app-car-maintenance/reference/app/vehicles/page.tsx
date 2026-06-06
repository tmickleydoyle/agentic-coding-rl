'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Vehicle } from '../../lib/types';

export function VehiclesPage() {
  const { vehicles, setVehicles, setServiceRecords, setReminders } = useApp();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [newMileages, setNewMileages] = useState<Record<string, string>>({});

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!make.trim() || !model.trim() || Number(year) <= 0) return;
    const v: Vehicle = { id: `v${Date.now()}`, make: make.trim(), model: model.trim(), year: Number(year), mileage: Number(mileage) || 0 };
    setVehicles(prev => [...prev, v]);
    setMake(''); setModel(''); setYear(''); setMileage('');
  }

  function handleUpdateMileage(id: string) {
    const m = Number(newMileages[id]);
    if (!m) return;
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, mileage: m } : v));
    setNewMileages(prev => ({ ...prev, [id]: '' }));
  }

  function handleDelete(id: string) {
    setServiceRecords(prev => prev.filter(s => s.vehicleId !== id));
    setReminders(prev => prev.filter(r => r.vehicleId !== id));
    setVehicles(prev => prev.filter(v => v.id !== id));
  }

  return (
    <div>
      <h2>Vehicles</h2>
      <form data-testid="vehicle-add-form" onSubmit={handleAdd}>
        <input data-testid="vehicle-make-input" value={make} onChange={e => setMake(e.target.value)} placeholder="Make" />
        <input data-testid="vehicle-model-input" value={model} onChange={e => setModel(e.target.value)} placeholder="Model" />
        <input data-testid="vehicle-year-input" type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" />
        <input data-testid="vehicle-mileage-input" type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="Mileage" />
        <button data-testid="vehicle-submit" type="submit">Add Vehicle</button>
      </form>
      <ul data-testid="vehicle-list">
        {vehicles.map(v => (
          <li key={v.id} data-testid="vehicle-item">
            <span>{v.make} {v.model}</span>
            <span data-testid="vehicle-mileage-field">{v.mileage}</span>
            <input value={newMileages[v.id] || ''} onChange={e => setNewMileages(prev => ({ ...prev, [v.id]: e.target.value }))} placeholder="New mileage" />
            <button data-testid="vehicle-mileage-update" onClick={() => handleUpdateMileage(v.id)}>Update</button>
            <button data-testid="vehicle-delete" onClick={() => handleDelete(v.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
