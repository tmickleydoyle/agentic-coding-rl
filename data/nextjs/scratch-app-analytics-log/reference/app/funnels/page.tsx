"use client";
import React, { useEffect, useState } from "react";
import { Funnel } from "../../lib/types";

export function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [funnelStats, setFunnelStats] = useState<Record<string, { step: string; count: number }[]>>({});
  const [name, setName] = useState("");
  const [stepsInput, setStepsInput] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/events/funnels").then((r) => r.json()).then((d) => {
      const fs: Funnel[] = d.funnels ?? [];
      setFunnels(fs);
      fs.forEach((f) => {
        fetch(`/api/events/funnels/${f.id}/stats`).then((r) => r.json()).then((s) => {
          setFunnelStats((prev) => ({ ...prev, [f.id]: s.stats ?? [] }));
        });
      });
    });
  };
  useEffect(() => { load(); }, []);

  const addFunnel = async () => {
    setError("");
    const steps = stepsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await fetch("/api/events/funnels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, steps }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setName(""); setStepsInput(""); load();
  };

  return (
    <div data-testid="funnels-page">
      <h1>Funnels</h1>
      {error && <div data-testid="funnels-error">{error}</div>}
      <div data-testid="add-funnel-form">
        <input data-testid="funnel-name" value={name} placeholder="Funnel name" onChange={(e) => setName(e.target.value)} />
        <input data-testid="funnel-steps" value={stepsInput} placeholder="Steps (comma-separated)" onChange={(e) => setStepsInput(e.target.value)} />
        <button data-testid="add-funnel-btn" onClick={addFunnel}>Add Funnel</button>
      </div>
      {funnels.length === 0 ? (
        <div data-testid="no-funnels">No funnels defined</div>
      ) : (
        <ul data-testid="funnels-list">
          {funnels.map((f) => (
            <li key={f.id} data-testid={`funnel-${f.id}`}>
              <span data-testid={`funnel-name-${f.id}`}>{f.name}</span>
              <ul>
                {(funnelStats[f.id] ?? []).map((s) => (
                  <li key={s.step} data-testid={`funnel-step-${f.id}-${s.step}`}>
                    {s.step}: {s.count}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
