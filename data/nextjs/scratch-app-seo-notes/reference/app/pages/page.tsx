"use client";
import React, { useEffect, useState } from "react";
import { PageAudit } from "../../lib/types";

export function PagesPage() {
  const [pages, setPages] = useState<PageAudit[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [score, setScore] = useState("80");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/keywords/pages").then((r) => r.json()).then((d) => setPages(d.pages ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const res = await fetch("/api/keywords/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title, metaDesc: "", issues: [], score: parseInt(score) || 0, lastAudit: new Date().toISOString().split("T")[0] }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setUrl(""); setTitle(""); load();
  };

  return (
    <div data-testid="pages-page">
      <h1>Page Audits</h1>
      {error && <div data-testid="pages-error">{error}</div>}
      <div data-testid="add-page-form">
        <input data-testid="page-url" value={url} placeholder="URL" onChange={(e) => setUrl(e.target.value)} />
        <input data-testid="page-title" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="page-score" type="number" value={score} onChange={(e) => setScore(e.target.value)} />
        <button data-testid="add-page-btn" onClick={add}>Add Page</button>
      </div>
      <ul data-testid="pages-list">
        {pages.map((p) => (
          <li key={p.id} data-testid={`page-${p.id}`}>
            <span data-testid={`page-url-${p.id}`}>{p.url}</span>
            <span data-testid={`page-score-${p.id}`}>{p.score}</span>
            <span data-testid={`page-issues-${p.id}`}>{p.issues.length} issues</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
