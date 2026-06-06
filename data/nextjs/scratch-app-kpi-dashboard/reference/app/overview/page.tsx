import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { Metric, MetricStatus } from "../../lib/types";

function getStatus(m: Metric): MetricStatus {
  if (m.unit === "percent" && m.name === "Churn Rate") {
    return m.currentValue <= m.targetValue ? "On Track" : m.currentValue <= m.targetValue * 1.3 ? "At Risk" : "Off Track";
  }
  const ratio = m.currentValue / m.targetValue;
  if (ratio >= 0.9) return "On Track";
  if (ratio >= 0.7) return "At Risk";
  return "Off Track";
}

function formatValue(m: Metric): string {
  if (m.unit === "currency") return `$${m.currentValue.toLocaleString()}`;
  if (m.unit === "percent") return `${m.currentValue}%`;
  return String(m.currentValue);
}

export default function OverviewPage() {
  const { metrics } = useApp();

  return (
    <div data-testid="overview-page">
      <h1>KPI Overview</h1>
      <div data-testid="kpi-grid">
        {metrics.map((m) => {
          const status = getStatus(m);
          return (
            <div key={m.id} data-testid={`kpi-card-${m.id}`}>
              <div data-testid={`kpi-name-${m.id}`}>{m.name}</div>
              <div data-testid={`kpi-value-${m.id}`}>{formatValue(m)}</div>
              <div data-testid={`kpi-target-${m.id}`}>Target: {m.unit === "currency" ? `$${m.targetValue.toLocaleString()}` : m.unit === "percent" ? `${m.targetValue}%` : m.targetValue}</div>
              <div data-testid={`kpi-status-${m.id}`}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
