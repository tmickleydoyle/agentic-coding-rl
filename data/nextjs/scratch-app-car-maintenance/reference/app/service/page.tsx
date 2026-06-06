'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { ServiceRecord } from '../../lib/types';

export function ServicePage() {
  const { vehicles, serviceRecords, setServiceRecords } = useApp();
  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [mileageAt, setMileageAt] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleId || !serviceType.trim() || !date) return;
    const s: ServiceRecord = {
      id: `s${Date.now()}`, vehicleId, serviceType: serviceType.trim(), date,
      mileageAtService: Number(mileageAt) || 0, cost: Number(cost) || 0, notes: notes.trim(),
    };
    setServiceRecords(prev => [...prev, s]);
    setVehicleId(''); setServiceType(''); setDate(''); setMileageAt(''); setCost(''); setNotes('');
  }

  return (
    <div>
      <h2>Service Records</h2>
      <form data-testid="service-add-form" onSubmit={handleAdd}>
        <select data-testid="service-vehicle-select" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
          <option value="">Select vehicle</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
        </select>
        <input data-testid="service-type-input" value={serviceType} onChange={e => setServiceType(e.target.value)} placeholder="Service type" />
        <input data-testid="service-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="service-mileage-input" type="number" value={mileageAt} onChange={e => setMileageAt(e.target.value)} placeholder="Mileage" />
        <input data-testid="service-cost-input" type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Cost" />
        <input data-testid="service-notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="service-submit" type="submit">Add Record</button>
      </form>
      <ul data-testid="service-list">
        {serviceRecords.map(s => (
          <li key={s.id} data-testid="service-item">
            <span>{s.serviceType}</span>
            <span>{s.date}</span>
            <span>{s.cost}</span>
            <button data-testid="service-delete" onClick={() => setServiceRecords(prev => prev.filter(x => x.id !== s.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
