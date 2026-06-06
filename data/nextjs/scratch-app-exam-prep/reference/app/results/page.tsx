import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { getAverageScore } from "../../lib/store";

export default function ResultsPage() {
  const { results } = useApp();
  const avg = getAverageScore();

  return (
    <div data-testid="results-page">
      <h2>My Results</h2>
      <div data-testid="avg-score">{avg}% average</div>
      <ul data-testid="result-list">
        {results.map(r => (
          <li key={r.id} data-testid={`result-item-${r.id}`}>
            <span data-testid={`result-exam-${r.id}`}>{r.examTitle}</span>
            <span data-testid={`result-score-${r.id}`}>{r.score}/{r.total}</span>
            <span data-testid={`result-date-${r.id}`}>{r.date}</span>
            <span data-testid={`result-pct-${r.id}`}>{Math.round((r.score / r.total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
