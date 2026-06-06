'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function GradesPage() {
  const { students, grades, subjects, setGrades } = useApp();
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');

  async function handleAdd() {
    if (!studentId || !subject || score === '') return;
    const res = await fetch('/api/gradebook?type=grade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentId: Number(studentId), subject, score: Number(score), maxScore: 100 }) });
    if (res.ok) {
      const grade = await res.json();
      setGrades([...grades, grade]);
      setScore('');
    }
  }

  function studentName(id: number) {
    return students.find((s) => s.id === id)?.name ?? 'Unknown';
  }

  return (
    <div data-testid="grades-page">
      <h2>Grades</h2>
      <div data-testid="add-grade-form">
        <select data-testid="grade-student-select" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input data-testid="grade-subject-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" list="subjects-list" />
        <datalist id="subjects-list">
          {subjects.map((s) => <option key={s} value={s} />)}
        </datalist>
        <input data-testid="grade-score-input" type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" />
        <button data-testid="add-grade-btn" onClick={handleAdd}>Add Grade</button>
      </div>
      <ul data-testid="grade-list">
        {grades.map((g) => (
          <li key={g.id} data-testid={`grade-${g.id}`}>
            <span data-testid={`grade-student-${g.id}`}>{studentName(g.studentId)}</span>
            <span data-testid={`grade-subject-${g.id}`}>{g.subject}</span>
            <span data-testid={`grade-score-${g.id}`}>{g.score}/{g.maxScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
