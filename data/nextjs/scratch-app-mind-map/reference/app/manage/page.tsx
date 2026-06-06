import React, { useState, useEffect } from "react";
import { MindMapNode } from "../../lib/types";

const COLORS = ["blue", "red", "green", "yellow", "purple"];

export function ManagePage() {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [label, setLabel] = useState("");
  const [parentId, setParentId] = useState("");
  const [color, setColor] = useState("blue");
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setNodes(d.nodes ?? []));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!label.trim()) { setError("Label is required"); return; }
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim(), parentId: parentId || null, color }),
    });
    setLabel(""); setParentId(""); setColor("blue"); setError(""); load();
  };

  const del = async (id: string) => {
    await fetch(`/api/items?id=${id}`, { method: "DELETE" }); load();
  };

  return (
    <div data-testid="manage-page">
      <h1>Manage Nodes</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="node-form">
        <input data-testid="input-label" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <select data-testid="input-parent" value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">Root</option>
          {nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        <select data-testid="input-color" value={color} onChange={(e) => setColor(e.target.value)}>
          {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="btn-submit" onClick={submit}>Add Node</button>
      </div>
      <ul data-testid="nodes-list">
        {nodes.map((n) => (
          <li key={n.id} data-testid={`node-row-${n.id}`}>
            <span data-testid={`node-label-row-${n.id}`}>{n.label}</span>
            <span data-testid={`node-color-row-${n.id}`}>{n.color}</span>
            <button data-testid={`btn-delete-${n.id}`} onClick={() => del(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
