import React, { useState, useEffect } from "react";
import { Decision, DecisionStatus } from "../../lib/types";

const STATUSES: DecisionStatus[] = ["pending", "decided", "revisited"];

export function LogPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [options, setOptions] = useState("");
  const [outcome, setOutcome] = useState("");
  const [status, setStatus] = useState<DecisionStatus>("pending");
  const [tags, setTags] = useState("");
  const [decisionDate, setDecisionDate] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setDecisions(d.decisions ?? []));
  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(""); setContext(""); setOptions(""); setOutcome(""); setStatus("pending"); setTags(""); setDecisionDate(""); setEditId(null); setError(""); };

  const submit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    const body = { title: title.trim(), context, options, outcome, status, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), decisionDate };
    if (editId) {
      await fetch(`/api/items?id=${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    reset(); load();
  };

  const startEdit = (d: Decision) => {
    setEditId(d.id); setTitle(d.title); setContext(d.context); setOptions(d.options);
    setOutcome(d.outcome); setStatus(d.status); setTags(d.tags.join(", ")); setDecisionDate(d.decisionDate);
  };

  const del = async (id: string) => { await fetch(`/api/items?id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div data-testid="log-page">
      <h1>Decision Log</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="decision-form">
        <input data-testid="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea data-testid="input-context" placeholder="Context" value={context} onChange={(e) => setContext(e.target.value)} />
        <textarea data-testid="input-options" placeholder="Options considered" value={options} onChange={(e) => setOptions(e.target.value)} />
        <textarea data-testid="input-outcome" placeholder="Outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as DecisionStatus)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input data-testid="input-tags" placeholder="Tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input data-testid="input-date" type="date" value={decisionDate} onChange={(e) => setDecisionDate(e.target.value)} />
        <button data-testid="btn-submit" onClick={submit}>{editId ? "Update" : "Add Decision"}</button>
        {editId && <button data-testid="btn-cancel" onClick={reset}>Cancel</button>}
      </div>
      <ul data-testid="decisions-list">
        {decisions.map((d) => (
          <li key={d.id} data-testid={`decision-item-${d.id}`}>
            <span data-testid={`decision-title-${d.id}`}>{d.title}</span>
            <span data-testid={`decision-status-${d.id}`}>{d.status}</span>
            <button data-testid={`btn-edit-${d.id}`} onClick={() => startEdit(d)}>Edit</button>
            <button data-testid={`btn-delete-${d.id}`} onClick={() => del(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
