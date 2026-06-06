"use client";
import React, { useEffect, useState } from "react";
import { Entry, Project } from "../../lib/types";

export function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []));
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []));
  }, []);

  const todayWords = entries
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.wordCount, 0);

  const recent = entries
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const projectMap: Record<string, string> = {};
  projects.forEach((p) => { projectMap[p.id] = p.name; });

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <div data-testid="today-words">{todayWords}</div>
      <div data-testid="active-projects-count">{projects.length}</div>
      <ul data-testid="recent-entries">
        {recent.map((e) => (
          <li key={e.id} data-testid={`recent-entry-${e.id}`}>
            {projectMap[e.projectId] ?? e.projectId} — {e.wordCount} words on {e.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
