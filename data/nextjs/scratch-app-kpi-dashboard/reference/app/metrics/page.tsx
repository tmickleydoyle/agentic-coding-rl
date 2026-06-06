import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Metric, MetricCategory, MetricUnit } from "../../lib/types";

const CATEGORIES: MetricCategory[] = ["Growth", "Revenue", "Engagement", "Ops"];
const UNITS: MetricUnit[] = ["number", "percent", "currency"];

export default function MetricsPage() {
  const { metrics, setMetrics } = useApp();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MetricCategory>("Growth");
  const [unit, setUnit] = useState<MetricUnit>("number");
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const cur = parseFloat(current);
    const tgt = parseFloat(target);
    if (!name.trim()) { setError("Name required"); return; }
    if (isNaN(cur)) { setError("Current value required"); return; }
    if (isNaN(tgt)) { setError("Target value required"); return; }
    setError("");
    const m: Metric = { id: String(Date.now()), name: name.trim(), category, unit, currentValue: cur, targetValue: tgt };
    setMetrics([...metrics, m]);
    setName(""); setCurrent(""); setTarget("");
  }

  return (
    <div data-testid="metrics-page">
      <h1>Metrics</h1>
      {error && <div data-testid="metric-error">{error}</div>}
      <div data-testid="add-metric-form">
        <input data-testid="metric-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="metric-category-select" value={category} onChange={(e) => setCategory(e.target.value as MetricCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select data-testid="metric-unit-select" value={unit} onChange={(e) => setUnit(e.target.value as MetricUnit)}>
          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <input data-testid="metric-current-input" type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current" />
        <input data-testid="metric-target-input" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target" />
        <button data-testid="add-metric-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="metric-list">
        {metrics.map((m) => (
          <li key={m.id} data-testid={`metric-item-${m.id}`}>
            <span data-testid={`metric-name-${m.id}`}>{m.name}</span>
            <span data-testid={`metric-category-${m.id}`}>{m.category}</span>
            <button data-testid={`delete-metric-${m.id}`} onClick={() => setMetrics(metrics.filter((x) => x.id !== m.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
