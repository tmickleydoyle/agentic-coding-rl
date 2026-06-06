'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function AssignmentsPage() {
  const { assignments, setAssignments } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');

  async function handleAdd() {
    if (!name.trim() || !dueDate) return;
    const res = await fetch('/api/classes?type=assignment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, dueDate }) });
    if (res.ok) {
      const assignment = await res.json();
      setAssignments([...assignments, assignment]);
      setName('');
      setDueDate('');
      setShowForm(false);
    }
  }

  return (
    <div data-testid="assignments-page">
      <h2>Assignments</h2>
      <button data-testid="add-assignment-btn" onClick={() => setShowForm(!showForm)}>Add Assignment</button>
      {showForm && (
        <div data-testid="assignment-form">
          <input data-testid="assignment-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Assignment name" />
          <input data-testid="assignment-due-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button data-testid="assignment-submit-btn" onClick={handleAdd}>Submit</button>
        </div>
      )}
      {assignments.length === 0 ? (
        <p data-testid="no-assignments">No assignments</p>
      ) : (
        <ul data-testid="assignment-list">
          {assignments.map((a) => (
            <li key={a.id} data-testid={`assignment-${a.id}`}>
              <span data-testid={`assignment-name-${a.id}`}>{a.name}</span>
              <span data-testid={`assignment-due-${a.id}`}>{a.dueDate}</span>
              <span data-testid={`assignment-submitted-${a.id}`}>{a.submittedBy.length} submitted</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
