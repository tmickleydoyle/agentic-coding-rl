'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function RosterPage() {
  const { students, setStudents } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleAdd() {
    if (!name.trim()) { setError('Name is required'); return; }
    setError('');
    const res = await fetch('/api/classes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) {
      const student = await res.json();
      setStudents([...students, student]);
      setName('');
    }
  }

  async function handleRemove(id: number) {
    const res = await fetch('/api/classes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok || res.status === 204) {
      setStudents(students.filter((s) => s.id !== id));
    }
  }

  return (
    <div data-testid="roster-page">
      <h2>Roster</h2>
      <p data-testid="student-count">Students: {students.length}</p>
      {students.length === 0 ? (
        <p data-testid="no-students">No students</p>
      ) : (
        <ul data-testid="student-list">
          {students.map((s) => (
            <li key={s.id} data-testid={`student-${s.id}`}>
              <span data-testid={`student-name-${s.id}`}>{s.name}</span>
              <button data-testid={`remove-student-${s.id}`} onClick={() => handleRemove(s.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-student-form">
        {error && <p data-testid="add-error">{error}</p>}
        <input data-testid="student-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" />
        <button data-testid="add-student-btn" onClick={handleAdd}>Add Student</button>
      </div>
    </div>
  );
}
