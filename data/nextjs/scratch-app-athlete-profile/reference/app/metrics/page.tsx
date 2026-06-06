import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function MetricsPage() {
  const { metrics, addMetric } = useApp();
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [vo2max, setVo2max] = useState("");

  const sorted = [...metrics].sort((a, b) => b.date.localeCompare(a.date));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMetric(date, Number(weight), Number(height), Number(vo2max));
    setDate(""); setWeight(""); setHeight(""); setVo2max("");
  }

  return (
    <div data-testid="metrics-page">
      <h1>Metrics</h1>
      <form data-testid="add-metric-form" onSubmit={handleSubmit}>
        <input data-testid="input-metric-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-metric-weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" />
        <input data-testid="input-metric-height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height (cm)" />
        <input data-testid="input-metric-vo2max" type="number" value={vo2max} onChange={(e) => setVo2max(e.target.value)} placeholder="VO2max" />
        <button type="submit" data-testid="btn-add-metric">Add</button>
      </form>
      <ul data-testid="metrics-list">
        {sorted.map((m) => (
          <li key={m.id} data-testid={`metric-item-${m.id}`}>
            <span data-testid={`metric-date-${m.id}`}>{m.date}</span>
            <span data-testid={`metric-weight-${m.id}`}>{m.weight}kg</span>
            <span data-testid={`metric-vo2max-${m.id}`}>{m.vo2max}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
