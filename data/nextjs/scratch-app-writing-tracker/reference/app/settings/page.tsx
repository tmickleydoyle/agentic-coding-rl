"use client";
import React, { useEffect, useState } from "react";
import { Project } from "../../lib/types";

export function SettingsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState("500");
  const [color, setColor] = useState("blue");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/projects").then((r) => r.json()).then((d) => setProjects(d.projects ?? []));
  };

  useEffect(() => { load(); }, []);

  const addProject = async () => {
    setError("");
    if (!name.trim()) { setError("Name required"); return; }
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), dailyGoal: parseInt(dailyGoal, 10) || 500, color }),
    });
    setName("");
    load();
  };

  const deleteProject = async (id: string) => {
    setError("");
    const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    load();
  };

  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>
      {error && <div data-testid="settings-error">{error}</div>}
      <div data-testid="add-project-form">
        <input data-testid="project-name" value={name} placeholder="Project name" onChange={(e) => setName(e.target.value)} />
        <input data-testid="project-daily-goal" type="number" value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} />
        <input data-testid="project-color" value={color} placeholder="Color" onChange={(e) => setColor(e.target.value)} />
        <button data-testid="add-project-btn" onClick={addProject}>Add Project</button>
      </div>
      <ul data-testid="projects-list">
        {projects.map((p) => (
          <li key={p.id} data-testid={`project-${p.id}`}>
            <span data-testid={`project-name-${p.id}`}>{p.name}</span>
            <span data-testid={`project-goal-${p.id}`}>{p.dailyGoal}</span>
            <button data-testid={`delete-project-${p.id}`} onClick={() => deleteProject(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
