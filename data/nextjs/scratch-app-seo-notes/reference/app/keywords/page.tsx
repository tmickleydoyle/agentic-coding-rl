"use client";
import React, { useEffect, useState } from "react";
import { Keyword } from "../../lib/types";

export function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keyword, setKeyword] = useState("");
  const [volume, setVolume] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [position, setPosition] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/keywords").then((r) => r.json()).then((d) => setKeywords(d.keywords ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    if (!keyword.trim()) { setError("Keyword required"); return; }
    const res = await fetch("/api/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, volume: parseInt(volume) || 0, difficulty: parseInt(difficulty) || 0, position: parseInt(position) || 0, targetUrl, notes: "" }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setKeyword(""); setVolume(""); setDifficulty(""); setPosition(""); setTargetUrl("");
    load();
  };

  const del = async (id: string) => {
    await fetch(`/api/keywords?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="keywords-page">
      <h1>Keywords</h1>
      {error && <div data-testid="keywords-error">{error}</div>}
      <div data-testid="add-keyword-form">
        <input data-testid="keyword-text" value={keyword} placeholder="Keyword" onChange={(e) => setKeyword(e.target.value)} />
        <input data-testid="keyword-volume" type="number" value={volume} placeholder="Volume" onChange={(e) => setVolume(e.target.value)} />
        <input data-testid="keyword-difficulty" type="number" value={difficulty} placeholder="Difficulty" onChange={(e) => setDifficulty(e.target.value)} />
        <input data-testid="keyword-position" type="number" value={position} placeholder="Position" onChange={(e) => setPosition(e.target.value)} />
        <input data-testid="keyword-url" value={targetUrl} placeholder="Target URL" onChange={(e) => setTargetUrl(e.target.value)} />
        <button data-testid="add-keyword-btn" onClick={add}>Add Keyword</button>
      </div>
      <ul data-testid="keywords-list">
        {keywords.map((k) => (
          <li key={k.id} data-testid={`keyword-${k.id}`}>
            <span data-testid={`keyword-text-${k.id}`}>{k.keyword}</span>
            <span data-testid={`keyword-position-${k.id}`}>{k.position}</span>
            <span data-testid={`keyword-volume-${k.id}`}>{k.volume}</span>
            <button data-testid={`delete-keyword-${k.id}`} onClick={() => del(k.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
