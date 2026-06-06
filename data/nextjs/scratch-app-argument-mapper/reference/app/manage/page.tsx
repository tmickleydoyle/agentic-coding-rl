import React, { useState, useEffect } from "react";
import { Argument, ArgumentType } from "../../lib/types";

const TYPES: ArgumentType[] = ["claim", "support", "rebuttal", "evidence"];

export function ManagePage() {
  const [args, setArgs] = useState<Argument[]>([]);
  const [text, setText] = useState("");
  const [type, setType] = useState<ArgumentType>("claim");
  const [parentId, setParentId] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setArgs(d.arguments ?? []));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!text.trim()) { setError("Text is required"); return; }
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim(), type, parentId: parentId || null, topic }),
    });
    setText(""); setType("claim"); setParentId(""); setTopic(""); setError(""); load();
  };

  const del = async (id: string) => { await fetch(`/api/items?id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div data-testid="manage-page">
      <h1>Manage Arguments</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="arg-form">
        <textarea data-testid="input-text" placeholder="Argument text" value={text} onChange={(e) => setText(e.target.value)} />
        <select data-testid="input-type" value={type} onChange={(e) => setType(e.target.value as ArgumentType)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select data-testid="input-parent" value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">None (top-level)</option>
          {args.map((a) => <option key={a.id} value={a.id}>{a.text.slice(0, 40)}</option>)}
        </select>
        <input data-testid="input-topic" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <button data-testid="btn-submit" onClick={submit}>Add Argument</button>
      </div>
      <ul data-testid="args-list">
        {args.map((a) => (
          <li key={a.id} data-testid={`arg-row-${a.id}`}>
            <span data-testid={`arg-text-row-${a.id}`}>{a.text}</span>
            <span data-testid={`arg-type-row-${a.id}`}>{a.type}</span>
            <button data-testid={`btn-delete-${a.id}`} onClick={() => del(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
