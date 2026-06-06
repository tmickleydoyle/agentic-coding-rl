'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function LogsPage() {
  const { projects, entries, addEntry, deleteEntry } = useApp();
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  function handleAdd() {
    if (!description.trim()) { setError('Description required'); return; }
    const h = parseFloat(hours);
    if (isNaN(h) || h <= 0) { setError('Hours must be positive'); return; }
    setError('');
    addEntry({ projectId, description: description.trim(), hours: h, date });
    setDescription(''); setHours('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Time Logs</h1>
      {error && <div data-testid="log-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <select data-testid="log-project" value={projectId} onChange={e => setProjectId(e.target.value)}>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="log-description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input data-testid="log-hours" type="number" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} />
        <input data-testid="log-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button data-testid="add-log-btn" onClick={handleAdd}>Add</button>
      </div>
      <table>
        <thead><tr><th>Project</th><th>Description</th><th>Hours</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {entries.map(e => {
            const proj = projects.find(p => p.id === e.projectId);
            return (
              <tr key={e.id} data-testid={`log-row-${e.id}`}>
                <td>{proj?.name ?? e.projectId}</td>
                <td>{e.description}</td>
                <td>{e.hours.toFixed(1)}</td>
                <td>{e.date}</td>
                <td><button data-testid={`delete-log-${e.id}`} onClick={() => deleteEntry(e.id)}>Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
