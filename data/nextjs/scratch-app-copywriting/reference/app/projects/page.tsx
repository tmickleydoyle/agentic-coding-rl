"use client";
import React, { useEffect, useState } from "react";
import { CopyProject } from "../../lib/types";

export function ProjectsPage() {
  const [projects, setProjects] = useState<CopyProject[]>([]);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/copies/projects").then((r) => r.json()).then((d) => setProjects(d.projects ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const res = await fetch("/api/copies/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, client, status: "active", deadline }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setName(""); setClient(""); setDeadline(""); load();
  };

  return (
    <div data-testid="projects-page">
      <h1>Projects</h1>
      {error && <div data-testid="projects-error">{error}</div>}
      <div data-testid="add-project-form">
        <input data-testid="project-name" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input data-testid="project-client" value={client} placeholder="Client" onChange={(e) => setClient(e.target.value)} />
        <input data-testid="project-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button data-testid="add-project-btn" onClick={add}>Add Project</button>
      </div>
      {projects.length === 0 ? (
        <div data-testid="no-projects">No projects</div>
      ) : (
        <ul data-testid="projects-list">
          {projects.map((p) => (
            <li key={p.id} data-testid={`project-${p.id}`}>
              <span data-testid={`project-name-${p.id}`}>{p.name}</span>
              <span data-testid={`project-client-${p.id}`}>{p.client}</span>
              <span data-testid={`project-status-${p.id}`}>{p.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
