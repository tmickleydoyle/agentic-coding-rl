import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { getBestScoreByOperation } from "../../lib/store";
import type { Operation } from "../../lib/types";

const OPERATIONS: Operation[] = ["addition", "subtraction", "multiplication", "division"];

export default function ScoresPage() {
  const { scores } = useApp();

  return (
    <div data-testid="scores-page">
      <h2>Scores</h2>
      <div data-testid="score-count">{scores.length} attempts</div>
      <div data-testid="best-scores">
        {OPERATIONS.map(op => (
          <div key={op} data-testid={`best-${op}`}>
            {op}: {getBestScoreByOperation(op)}% best
          </div>
        ))}
      </div>
      <ul data-testid="score-list">
        {scores.map(s => (
          <li key={s.id} data-testid={`score-item-${s.id}`}>
            <span data-testid={`score-operation-${s.id}`}>{s.operation}</span>
            <span data-testid={`score-result-${s.id}`}>{s.correct}/{s.total}</span>
            <span data-testid={`score-pct-${s.id}`}>{Math.round((s.correct / s.total) * 100)}%</span>
            <span data-testid={`score-date-${s.id}`}>{s.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
