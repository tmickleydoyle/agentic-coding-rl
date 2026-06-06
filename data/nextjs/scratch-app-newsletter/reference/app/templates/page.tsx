"use client";
import React, { useEffect, useState } from "react";
import { Template } from "../../lib/types";

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/templates").then((r) => r.json()).then((d) => setTemplates(d.templates ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    if (!name.trim()) { setError("Name required"); return; }
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, body }),
    });
    setName(""); setSubject(""); setBody(""); load();
  };

  const del = async (id: string) => {
    setError("");
    const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    load();
  };

  return (
    <div data-testid="templates-page">
      <h1>Templates</h1>
      {error && <div data-testid="templates-error">{error}</div>}
      <div data-testid="add-template-form">
        <input data-testid="template-name" value={name} placeholder="Template name" onChange={(e) => setName(e.target.value)} />
        <input data-testid="template-subject" value={subject} placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
        <textarea data-testid="template-body" value={body} placeholder="Body" onChange={(e) => setBody(e.target.value)} />
        <button data-testid="add-template-btn" onClick={add}>Add Template</button>
      </div>
      <ul data-testid="templates-list">
        {templates.map((t) => (
          <li key={t.id} data-testid={`template-${t.id}`}>
            <span data-testid={`template-name-${t.id}`}>{t.name}</span>
            <button data-testid={`delete-template-${t.id}`} onClick={() => del(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
