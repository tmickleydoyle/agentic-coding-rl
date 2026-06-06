import React, { useState, useEffect } from "react";
import { Objective, OkrStatus } from "../../lib/types";

const STATUSES: OkrStatus[] = ["on_track", "at_risk", "behind", "completed"];

export function ObjectivesPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quarter, setQuarter] = useState("");
  const [status, setStatus] = useState<OkrStatus>("on_track");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setObjectives(d.objectives ?? []));
  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(""); setDescription(""); setQuarter(""); setStatus("on_track"); setEditId(null); setError(""); };

  const submit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    const body = { title: title.trim(), description, quarter, status, keyResults: [] };
    if (editId) {
      await fetch(`/api/items?id=${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    reset(); load();
  };

  const startEdit = (o: Objective) => {
    setEditId(o.id); setTitle(o.title); setDescription(o.description); setQuarter(o.quarter); setStatus(o.status);
  };

  const del = async (id: string) => { await fetch(`/api/items?id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div data-testid="objectives-page">
      <h1>Objectives</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="objective-form">
        <input data-testid="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea data-testid="input-description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input data-testid="input-quarter" placeholder="Quarter (e.g. Q1 2024)" value={quarter} onChange={(e) => setQuarter(e.target.value)} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as OkrStatus)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button data-testid="btn-submit" onClick={submit}>{editId ? "Update" : "Add Objective"}</button>
        {editId && <button data-testid="btn-cancel" onClick={reset}>Cancel</button>}
      </div>
      <ul data-testid="objectives-list">
        {objectives.map((o) => (
          <li key={o.id} data-testid={`objective-item-${o.id}`}>
            <span data-testid={`objective-title-${o.id}`}>{o.title}</span>
            <span data-testid={`objective-status-${o.id}`}>{o.status}</span>
            <span data-testid={`objective-quarter-${o.id}`}>{o.quarter}</span>
            <span data-testid={`objective-kr-count-${o.id}`}>{o.keyResults.length} KRs</span>
            <button data-testid={`btn-edit-${o.id}`} onClick={() => startEdit(o)}>Edit</button>
            <button data-testid={`btn-delete-${o.id}`} onClick={() => del(o.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
