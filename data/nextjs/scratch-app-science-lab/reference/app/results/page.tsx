import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addResult, deleteResult } from "../../lib/store";

export default function ResultsPage() {
  const { results, setResults, experiments } = useApp();
  const [experimentId, setExperimentId] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!experimentId || !measurement.trim() || !value || !unit.trim()) { setError("All fields required"); return; }
    const v = parseFloat(value);
    if (isNaN(v)) { setError("Value must be a number"); return; }
    const exp = experiments.find(e => e.id === experimentId);
    if (!exp) { setError("Experiment not found"); return; }
    const r = addResult({ experimentId, experimentTitle: exp.title, measurement: measurement.trim(), value: v, unit: unit.trim(), recordedAt: new Date().toISOString().slice(0, 10) });
    setResults([...results, r]);
    setExperimentId(""); setMeasurement(""); setValue(""); setUnit(""); setError("");
  }

  function handleDelete(id: string) {
    deleteResult(id);
    setResults(results.filter(r => r.id !== id));
  }

  return (
    <div data-testid="results-page">
      <h2>Lab Results</h2>
      <div data-testid="result-count">{results.length} measurements recorded</div>
      {error && <div data-testid="result-error">{error}</div>}
      <ul data-testid="result-list">
        {results.map(r => (
          <li key={r.id} data-testid={`result-item-${r.id}`}>
            <span data-testid={`result-experiment-${r.id}`}>{r.experimentTitle}</span>
            <span data-testid={`result-measurement-${r.id}`}>{r.measurement}</span>
            <span data-testid={`result-value-${r.id}`}>{r.value} {r.unit}</span>
            <span data-testid={`result-date-${r.id}`}>{r.recordedAt}</span>
            <button data-testid={`btn-delete-result-${r.id}`} onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-result-form">
        <select data-testid="select-experiment" value={experimentId} onChange={e => setExperimentId(e.target.value)}>
          <option value="">Select experiment</option>
          {experiments.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <input data-testid="input-measurement" value={measurement} onChange={e => setMeasurement(e.target.value)} placeholder="Measurement name" />
        <input data-testid="input-value" value={value} onChange={e => setValue(e.target.value)} placeholder="Value" />
        <input data-testid="input-unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unit" />
        <button data-testid="btn-add-result" onClick={handleAdd}>Add Result</button>
      </div>
    </div>
  );
}
