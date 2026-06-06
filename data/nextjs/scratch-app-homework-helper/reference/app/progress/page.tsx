import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { getSubjectStats } from "../../lib/store";

export default function ProgressPage() {
  const { assignments } = useApp();
  const stats = getSubjectStats();
  const totalDone = assignments.filter(a => a.status === "done").length;
  const totalMins = assignments.filter(a => a.status !== "done").reduce((sum, a) => sum + a.estimatedMinutes, 0);

  return (
    <div data-testid="progress-page">
      <h2>Progress</h2>
      <div data-testid="total-done">{totalDone} assignments done</div>
      <div data-testid="remaining-minutes">{totalMins} minutes remaining</div>
      <ul data-testid="stats-list">
        {stats.map(s => (
          <li key={s.subject} data-testid={`stat-item-${s.subject.toLowerCase()}`}>
            <span data-testid={`stat-subject-${s.subject.toLowerCase()}`}>{s.subject}</span>
            <span data-testid={`stat-done-${s.subject.toLowerCase()}`}>{s.done}/{s.total}</span>
            <span data-testid={`stat-pct-${s.subject.toLowerCase()}`}>{Math.round((s.done / s.total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
