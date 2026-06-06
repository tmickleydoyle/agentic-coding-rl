"use client";
import React, { useEffect, useState } from "react";
import { Backlink, BacklinkStatus } from "../../lib/types";

export function BacklinksPage() {
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [filter, setFilter] = useState<"all" | BacklinkStatus>("all");
  const [sourceUrl, setSourceUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const [da, setDa] = useState("");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/keywords/backlinks").then((r) => r.json()).then((d) => setBacklinks(d.backlinks ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const res = await fetch("/api/keywords/backlinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceUrl, targetUrl, anchorText, da: parseInt(da) || 0, status: "new" }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setSourceUrl(""); setTargetUrl(""); setAnchorText(""); setDa(""); load();
  };

  const visible = filter === "all" ? backlinks : backlinks.filter((b) => b.status === filter);

  return (
    <div data-testid="backlinks-page">
      <h1>Backlinks</h1>
      {error && <div data-testid="backlinks-error">{error}</div>}
      <div data-testid="add-backlink-form">
        <input data-testid="backlink-source" value={sourceUrl} placeholder="Source URL" onChange={(e) => setSourceUrl(e.target.value)} />
        <input data-testid="backlink-target" value={targetUrl} placeholder="Target URL" onChange={(e) => setTargetUrl(e.target.value)} />
        <input data-testid="backlink-anchor" value={anchorText} placeholder="Anchor text" onChange={(e) => setAnchorText(e.target.value)} />
        <input data-testid="backlink-da" type="number" value={da} placeholder="DA" onChange={(e) => setDa(e.target.value)} />
        <button data-testid="add-backlink-btn" onClick={add}>Add Backlink</button>
      </div>
      <select data-testid="backlink-filter" value={filter} onChange={(e) => setFilter(e.target.value as "all" | BacklinkStatus)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="lost">Lost</option>
        <option value="new">New</option>
      </select>
      {visible.length === 0 ? (
        <div data-testid="no-backlinks">No backlinks tracked</div>
      ) : (
        <ul data-testid="backlinks-list">
          {visible.map((b) => (
            <li key={b.id} data-testid={`backlink-${b.id}`}>
              <span data-testid={`backlink-source-${b.id}`}>{b.sourceUrl}</span>
              <span data-testid={`backlink-status-${b.id}`}>{b.status}</span>
              <span data-testid={`backlink-da-${b.id}`}>{b.da}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
