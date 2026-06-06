"use client";
import React, { useEffect, useState } from "react";
import { Brief, CopyProject } from "../../lib/types";

export function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [projects, setProjects] = useState<CopyProject[]>([]);
  const [projectId, setProjectId] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [goal, setGoal] = useState("");
  const [keyMessages, setKeyMessages] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/copies/briefs").then((r) => r.json()).then((d) => setBriefs(d.briefs ?? []));
    fetch("/api/copies/projects").then((r) => r.json()).then((d) => {
      const ps: CopyProject[] = d.projects ?? [];
      setProjects(ps);
      if (ps.length > 0 && !projectId) setProjectId(ps[0].id);
    });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const res = await fetch("/api/copies/briefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, audience, tone, goal, keyMessages }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setAudience(""); setTone(""); setGoal(""); setKeyMessages(""); load();
  };

  const projectMap: Record<string, string> = {};
  projects.forEach((p) => { projectMap[p.id] = p.name; });

  return (
    <div data-testid="briefs-page">
      <h1>Briefs</h1>
      {error && <div data-testid="briefs-error">{error}</div>}
      <div data-testid="add-brief-form">
        <select data-testid="brief-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="brief-audience" value={audience} placeholder="Audience" onChange={(e) => setAudience(e.target.value)} />
        <input data-testid="brief-tone" value={tone} placeholder="Tone" onChange={(e) => setTone(e.target.value)} />
        <input data-testid="brief-goal" value={goal} placeholder="Goal" onChange={(e) => setGoal(e.target.value)} />
        <input data-testid="brief-messages" value={keyMessages} placeholder="Key messages" onChange={(e) => setKeyMessages(e.target.value)} />
        <button data-testid="add-brief-btn" onClick={add}>Add Brief</button>
      </div>
      <ul data-testid="briefs-list">
        {briefs.map((b) => (
          <li key={b.id} data-testid={`brief-${b.id}`}>
            <span data-testid={`brief-project-${b.id}`}>{projectMap[b.projectId] ?? b.projectId}</span>
            <span data-testid={`brief-goal-${b.id}`}>{b.goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
