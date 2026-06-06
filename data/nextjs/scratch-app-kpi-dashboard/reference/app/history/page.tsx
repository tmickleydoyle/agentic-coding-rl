import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { HistoryEntry } from "../../lib/types";

export default function HistoryPage() {
  const { metrics, history, setHistory } = useApp();
  const [metricId, setMetricId] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const val = parseFloat(value);
    if (!metricId) { setError("Select metric"); return; }
    if (isNaN(val)) { setError("Value required"); return; }
    if (!date) { setError("Date required"); return; }
    setError("");
    const entry: HistoryEntry = { id: String(Date.now()), metricId, value: val, date };
    setHistory([...history, entry]);
    setValue(""); setDate("");
  }

  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div data-testid="history-page">
      <h1>History</h1>
      {error && <div data-testid="history-error">{error}</div>}
      <div data-testid="add-history-form">
        <select data-testid="history-metric-select" value={metricId} onChange={(e) => setMetricId(e.target.value)}>
          <option value="">Select metric</option>
          {metrics.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input data-testid="history-value-input" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" />
        <input data-testid="history-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-history-btn" onClick={handleAdd}>Add</button>
      </div>
      {sorted.length === 0 ? (
        <div data-testid="no-history">No history</div>
      ) : (
        <ul data-testid="history-list">
          {sorted.map((h) => {
            const m = metrics.find((x) => x.id === h.metricId);
            return (
              <li key={h.id} data-testid={`history-item-${h.id}`}>
                <span data-testid={`history-metric-${h.id}`}>{m ? m.name : "Unknown"}</span>
                <span data-testid={`history-value-${h.id}`}>{h.value}</span>
                <span data-testid={`history-date-${h.id}`}>{h.date}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
