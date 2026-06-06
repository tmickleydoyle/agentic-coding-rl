'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { AttendanceStatus } from '../../lib/types';

export function AttendancePage() {
  const { students, records, setRecords } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [statuses, setStatuses] = useState<Record<number, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  function getStatus(studentId: number): AttendanceStatus {
    if (statuses[studentId]) return statuses[studentId];
    const rec = records.find((r) => r.studentId === studentId && r.date === date);
    return rec ? rec.status : 'present';
  }

  async function handleSave() {
    const entries = students.map((s) => ({ studentId: s.id, status: getStatus(s.id) }));
    const res = await fetch('/api/attendance?type=records', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, records: entries }) });
    if (res.ok) {
      const newRecords = await res.json();
      setRecords([...records.filter((r) => r.date !== date), ...newRecords]);
      setSaved(true);
    }
  }

  return (
    <div data-testid="attendance-page">
      <h2>Mark Attendance</h2>
      <input data-testid="date-input" type="date" value={date} onChange={(e) => { setDate(e.target.value); setSaved(false); setStatuses({}); }} />
      {saved && <p data-testid="saved-msg">Attendance saved</p>}
      <ul data-testid="attendance-list">
        {students.map((s) => (
          <li key={s.id} data-testid={`attendance-row-${s.id}`}>
            <span data-testid={`attendance-name-${s.id}`}>{s.name}</span>
            <select
              data-testid={`attendance-status-${s.id}`}
              value={getStatus(s.id)}
              onChange={(e) => setStatuses({ ...statuses, [s.id]: e.target.value as AttendanceStatus })}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </li>
        ))}
      </ul>
      <button data-testid="save-attendance-btn" onClick={handleSave}>Save Attendance</button>
    </div>
  );
}
