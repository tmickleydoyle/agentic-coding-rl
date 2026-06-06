"use client";
import React, { useEffect, useState } from "react";
import { Copy, Brief } from "../../lib/types";

export function CopiesPage() {
  const [copies, setCopies] = useState<Copy[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [briefId, setBriefId] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/copies").then((r) => r.json()).then((d) => setCopies(d.copies ?? []));
    fetch("/api/copies/briefs").then((r) => r.json()).then((d) => {
      const bs: Brief[] = d.briefs ?? [];
      setBriefs(bs);
      if (bs.length > 0 && !briefId) setBriefId(bs[0].id);
    });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const res = await fetch("/api/copies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ briefId, headline, body, cta, status: "draft", rating: 0 }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setHeadline(""); setBody(""); setCta(""); load();
  };

  return (
    <div data-testid="copies-page">
      <h1>Copies</h1>
      {error && <div data-testid="copies-error">{error}</div>}
      <div data-testid="add-copy-form">
        <select data-testid="copy-brief" value={briefId} onChange={(e) => setBriefId(e.target.value)}>
          {briefs.map((b) => <option key={b.id} value={b.id}>{b.goal}</option>)}
        </select>
        <input data-testid="copy-headline" value={headline} placeholder="Headline" onChange={(e) => setHeadline(e.target.value)} />
        <textarea data-testid="copy-body" value={body} placeholder="Body" onChange={(e) => setBody(e.target.value)} />
        <input data-testid="copy-cta" value={cta} placeholder="CTA" onChange={(e) => setCta(e.target.value)} />
        <button data-testid="add-copy-btn" onClick={add}>Add Copy</button>
      </div>
      <ul data-testid="copies-list">
        {copies.map((c) => (
          <li key={c.id} data-testid={`copy-${c.id}`}>
            <span data-testid={`copy-headline-${c.id}`}>{c.headline}</span>
            <span data-testid={`copy-status-${c.id}`}>{c.status}</span>
            <span data-testid={`copy-rating-${c.id}`}>{c.rating}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
