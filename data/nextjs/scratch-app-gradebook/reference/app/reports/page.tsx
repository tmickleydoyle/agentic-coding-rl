'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

function letterGrade(avg: number): string {
  if (avg >= 90) return 'A';
  if (avg >= 80) return 'B';
  if (avg >= 70) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
}

export function ReportsPage() {
  const { students, grades } = useApp();

  const allScores = grades.map((g) => g.score);
  const classAvg = allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 'N/A';

  return (
    <div data-testid="reports-page">
      <h2>Reports</h2>
      <p data-testid="class-average">Class Average: {classAvg}</p>
      <ul data-testid="report-list">
        {students.map((s) => {
          const sg = grades.filter((g) => g.studentId === s.id);
          const avg = sg.length > 0 ? (sg.reduce((a, g) => a + g.score, 0) / sg.length).toFixed(1) : 'N/A';
          const letter = sg.length > 0 ? letterGrade(parseFloat(avg)) : '';
          return (
            <li key={s.id} data-testid={`report-${s.id}`}>
              <span data-testid={`report-name-${s.id}`}>{s.name}</span>
              <span data-testid={`report-avg-${s.id}`}>{avg}</span>
              {letter && <span data-testid={`report-letter-${s.id}`}>{letter}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
