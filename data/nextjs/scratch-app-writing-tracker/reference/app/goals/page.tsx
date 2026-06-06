"use client";
import React, { useEffect, useState } from "react";
import { Goal, Project, Entry } from "../../lib/types";

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [projectId, setProjectId] = useState("");
  const [type, setType] = useState<"daily" | "weekly">("daily");
  const [target, setTarget] = useState("");

  const load = () => {
    fetch("/api/goals").then((r) => r.json()).then((d) => setGoals(d.goals ?? []));
    fetch("/api/projects").then((r) => r.json()).then((d) => {
      const ps: Project[] = d.projects ?? [];
      setProjects(ps);
      if (ps.length > 0 && !projectId) setProjectId(ps[0].id);
    });
    fetch("/api/entries").then((r) => r.json()).then((d) => setEntries(d.entries ?? []));
  };

  useEffect(() => { load(); }, []);

  const addGoal = async () => {
    const t = parseInt(target, 10);
    if (!projectId || isNaN(t) || t <= 0) return;
    const today = new Date().toISOString().split("T")[0];
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, type, target: t, startDate: today, completed: false }),
    });
    setTarget("");
    load();
  };

  const toggleComplete = async (g: Goal) => {
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: g.id, completed: !g.completed }),
    });
    load();
  };

  const projectMap: Record<string, string> = {};
  projects.forEach((p) => { projectMap[p.id] = p.name; });

  const getProgress = (g: Goal): number => {
    return entries
      .filter((e) => e.projectId === g.projectId && e.date >= g.startDate)
      .reduce((s, e) => s + e.wordCount, 0);
  };

  return (
    <div data-testid="goals-page">
      <h1>Goals</h1>
      <div data-testid="add-goal-form">
        <select data-testid="goal-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select data-testid="goal-type" value={type} onChange={(e) => setType(e.target.value as "daily" | "weekly")}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input data-testid="goal-target" type="number" value={target} placeholder="Target words" onChange={(e) => setTarget(e.target.value)} />
        <button data-testid="add-goal-btn" onClick={addGoal}>Add Goal</button>
      </div>
      {goals.length === 0 ? (
        <div data-testid="no-goals">No goals set</div>
      ) : (
        <ul data-testid="goals-list">
          {goals.map((g) => {
            const progress = getProgress(g);
            const pct = Math.min(100, Math.round((progress / g.target) * 100));
            return (
              <li key={g.id} data-testid={`goal-${g.id}`}>
                <span data-testid={`goal-project-${g.id}`}>{projectMap[g.projectId] ?? g.projectId}</span>
                <span data-testid={`goal-type-${g.id}`}>{g.type}</span>
                <span data-testid={`goal-target-${g.id}`}>{g.target}</span>
                <span data-testid={`goal-progress-${g.id}`}>{progress}</span>
                <span data-testid={`goal-pct-${g.id}`}>{pct}%</span>
                <input
                  data-testid={`goal-complete-${g.id}`}
                  type="checkbox"
                  checked={g.completed}
                  onChange={() => toggleComplete(g)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
