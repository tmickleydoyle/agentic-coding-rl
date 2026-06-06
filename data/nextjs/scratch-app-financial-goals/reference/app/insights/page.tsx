import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { GoalCategory } from "../../lib/types";

const CATEGORIES: GoalCategory[] = ["purchase", "savings", "investment", "lifestyle", "education", "other"];

export function InsightsPage() {
  const { goals } = useApp();
  const avgPct = goals.length === 0 ? 0 : goals.reduce((sum, g) => sum + Math.min(100, (g.savedAmount / g.targetAmount) * 100), 0) / goals.length;
  const activeGoals = goals.filter((g) => g.status === "active");
  const nearest = activeGoals.length === 0 ? null : activeGoals.reduce((best, g) => {
    const pct = g.savedAmount / g.targetAmount;
    const bestPct = best.savedAmount / best.targetAmount;
    return pct > bestPct ? g : best;
  });

  return (
    <div data-testid="insights-page">
      <h1>Insights</h1>
      <span data-testid="avg-completion">{avgPct.toFixed(1)}%</span>
      {nearest && (
        <div data-testid="nearest-goal">
          <span data-testid="nearest-goal-title">{nearest.title}</span>
        </div>
      )}
      <ul data-testid="category-groups">
        {CATEGORIES.map((cat) => {
          const catGoals = goals.filter((g) => g.category === cat);
          if (catGoals.length === 0) return null;
          return (
            <li key={cat} data-testid={`category-group-${cat}`}>
              <span data-testid={`category-label-${cat}`}>{cat}</span>
              <span data-testid={`category-count-${cat}`}>{catGoals.length}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
