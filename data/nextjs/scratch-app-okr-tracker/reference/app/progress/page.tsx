import React, { useState, useEffect } from "react";

interface ProgressSummary {
  total: number;
  avgProgress: number;
  byStatus: Record<string, number>;
}

export function ProgressPage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    fetch("/api/items?summary=1").then((r) => r.json()).then((d) => {
      if (d.summary) setSummary(d.summary);
    });
  }, []);

  if (!summary) return <div data-testid="progress-page"><p data-testid="loading">Loading...</p></div>;

  return (
    <div data-testid="progress-page">
      <h1>OKR Progress</h1>
      <p data-testid="total-objectives">Total Objectives: {summary.total}</p>
      <p data-testid="avg-progress">Average KR Progress: {summary.avgProgress}%</p>
      <ul data-testid="status-breakdown">
        <li data-testid="status-on-track">On Track: <span data-testid="count-on-track">{summary.byStatus.on_track ?? 0}</span></li>
        <li data-testid="status-at-risk">At Risk: <span data-testid="count-at-risk">{summary.byStatus.at_risk ?? 0}</span></li>
        <li data-testid="status-behind">Behind: <span data-testid="count-behind">{summary.byStatus.behind ?? 0}</span></li>
        <li data-testid="status-completed">Completed: <span data-testid="count-completed">{summary.byStatus.completed ?? 0}</span></li>
      </ul>
    </div>
  );
}
