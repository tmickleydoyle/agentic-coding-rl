import React, { useState, useEffect } from "react";
import { Objective } from "../../lib/types";

export function KeyResultsPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [krTitle, setKrTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setObjectives(d.objectives ?? []));
  useEffect(() => { load(); }, []);

  const selected = objectives.find((o) => o.id === selectedId);

  const addKr = async () => {
    if (!krTitle.trim()) { setError("KR title is required"); return; }
    if (!selectedId) { setError("Select an objective"); return; }
    await fetch(`/api/items?id=${selectedId}&action=addkr`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: krTitle.trim(), target: Number(target) || 0, current: Number(current) || 0, unit }),
    });
    setKrTitle(""); setTarget(""); setCurrent(""); setUnit(""); setError(""); load();
  };

  const updateProgress = async (krId: string, newCurrent: number) => {
    await fetch(`/api/items?id=${selectedId}&action=updatekr&krId=${krId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: newCurrent }),
    });
    load();
  };

  return (
    <div data-testid="keyresults-page">
      <h1>Key Results</h1>
      <select data-testid="select-objective" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Select objective</option>
        {objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
      </select>
      {error && <p data-testid="form-error">{error}</p>}
      {selectedId && (
        <>
          <div data-testid="kr-form">
            <input data-testid="input-kr-title" placeholder="Key result title" value={krTitle} onChange={(e) => setKrTitle(e.target.value)} />
            <input data-testid="input-target" type="number" placeholder="Target" value={target} onChange={(e) => setTarget(e.target.value)} />
            <input data-testid="input-current" type="number" placeholder="Current" value={current} onChange={(e) => setCurrent(e.target.value)} />
            <input data-testid="input-unit" placeholder="Unit (e.g. %, users)" value={unit} onChange={(e) => setUnit(e.target.value)} />
            <button data-testid="btn-add-kr" onClick={addKr}>Add Key Result</button>
          </div>
          <ul data-testid="kr-list">
            {(selected?.keyResults ?? []).map((kr) => (
              <li key={kr.id} data-testid={`kr-item-${kr.id}`}>
                <span data-testid={`kr-title-${kr.id}`}>{kr.title}</span>
                <span data-testid={`kr-progress-${kr.id}`}>{kr.current}/{kr.target} {kr.unit}</span>
                <input
                  type="number"
                  data-testid={`kr-current-input-${kr.id}`}
                  value={kr.current}
                  onChange={(e) => updateProgress(kr.id, Number(e.target.value))}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
