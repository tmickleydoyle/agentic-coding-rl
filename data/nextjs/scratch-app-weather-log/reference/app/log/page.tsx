'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import { WeatherEntry } from '../../lib/types';

export function LogPage() {
  const { entries, addEntry, deleteEntry } = useApp();
  const [date, setDate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [condition, setCondition] = useState<WeatherEntry['condition']>('sunny');
  const [humidity, setHumidity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!date) { setError('Date required'); return; }
    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    if (isNaN(hum) || hum < 0 || hum > 100) { setError('Humidity must be 0-100'); return; }
    const ok = addEntry(date, isNaN(temp) ? 0 : temp, condition, hum, notes);
    if (!ok) { setError('Entry for this date already exists'); return; }
    setDate(''); setTemperature(''); setHumidity(''); setNotes(''); setError('');
  };

  return (
    <main data-testid="log-page">
      <h2>Weather Log</h2>
      <div data-testid="add-entry-form">
        <input data-testid="entry-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="entry-temp-input" type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="Temperature" />
        <select data-testid="entry-condition-select" value={condition} onChange={e => setCondition(e.target.value as WeatherEntry['condition'])}>
          {(['sunny', 'cloudy', 'rainy', 'snowy', 'windy'] as const).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input data-testid="entry-humidity-input" type="number" value={humidity} onChange={e => setHumidity(e.target.value)} placeholder="Humidity %" />
        <input data-testid="entry-notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="add-entry-btn" onClick={handleAdd}>Add Entry</button>
        {error && <span data-testid="entry-error">{error}</span>}
      </div>
      <ul data-testid="entries-list">
        {entries.map(e => (
          <li key={e.id} data-testid={`entry-item-${e.id}`}>
            <span data-testid={`entry-date-${e.id}`}>{e.date}</span>
            <span data-testid={`entry-temp-${e.id}`}>{e.temperature}</span>
            <span data-testid={`entry-condition-${e.id}`}>{e.condition}</span>
            <button data-testid={`delete-entry-${e.id}`} onClick={() => deleteEntry(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
