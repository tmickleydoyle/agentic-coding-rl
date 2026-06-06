'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ChartsPage() {
  const { entries } = useApp();
  const conditions = ['cloudy', 'rainy', 'snowy', 'sunny', 'windy'];
  const avgByCondition: Record<string, number> = {};
  conditions.forEach(c => {
    const matching = entries.filter(e => e.condition === c);
    avgByCondition[c] = matching.length > 0
      ? Math.round((matching.reduce((s, e) => s + e.temperature, 0) / matching.length) * 10) / 10
      : 0;
  });

  const minTemp = entries.length > 0 ? Math.min(...entries.map(e => e.temperature)) : 0;
  const maxTemp = entries.length > 0 ? Math.max(...entries.map(e => e.temperature)) : 0;

  const conditionCounts: Record<string, number> = {};
  entries.forEach(e => { conditionCounts[e.condition] = (conditionCounts[e.condition] ?? 0) + 1; });
  const mostCommon = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none';

  return (
    <main data-testid="charts-page">
      <h2>Statistics</h2>
      <p data-testid="min-temp">Min: {minTemp}</p>
      <p data-testid="max-temp">Max: {maxTemp}</p>
      <p data-testid="most-common-condition">{mostCommon}</p>
      <ul data-testid="condition-stats">
        {conditions.map(c => (
          <li key={c} data-testid={`condition-stat-${c}`}>
            <span data-testid={`condition-name-${c}`}>{c}</span>
            <span data-testid={`condition-avg-${c}`}>{avgByCondition[c]}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
