'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StudentsPage() {
  const { students, records, setStudents, setRecords } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleAdd() {
    if (!name.trim()) { setError('Name required'); return; }
    setError('');
    const res = await fetch('/api/attendance?type=student', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) { const s = await res.json(); setStudents([...students, s]); setName(''); }
  }

  async function handleRemove(id: number) {
    const res = await fetch('/api/attendance?type=student', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok || res.status === 204) {
      setStudents(students.filter((s) => s.id !== id));
      setRecords(records.filter((r) => r.studentId !== id));
    }
  }

  return (
    <div data-testid="students-page">
      <h2>Students</h2>
      <p data-testid="student-count">Total: {students.length}</p>
      <ul data-testid="student-list">
        {students.map((s) => (
          <li key={s.id} data-testid={`student-${s.id}`}>
            <span data-testid={`student-name-${s.id}`}>{s.name}</span>
            <button data-testid={`remove-student-${s.id}`} onClick={() => handleRemove(s.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-student-form">
        {error && <p data-testid="student-error">{error}</p>}
        <input data-testid="student-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <button data-testid="add-student-btn" onClick={handleAdd}>Add Student</button>
      </div>
    </div>
  );
}
