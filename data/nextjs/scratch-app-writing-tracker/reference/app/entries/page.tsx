"use client";
import React, { useEffect, useState } from "react";
import { Entry, Project } from "../../lib/types";

export function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [wordCount, setWordCount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []));
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const ps: Project[] = d.projects ?? [];
        setProjects(ps);
        if (ps.length > 0 && !projectId) setProjectId(ps[0].id);
      });
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const wc = parseInt(wordCount, 10);
    if (!projectId || !date || isNaN(wc) || wc <= 0) {
      setError("Project, date, and positive word count required");
      return;
    }
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, date, wordCount: wc, notes }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setWordCount("");
    setNotes("");
    load();
  };

  const del = async (id: string) => {
    await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
    load();
  };

  const projectMap: Record<string, string> = {};
  projects.forEach((p) => { projectMap[p.id] = p.name; });

  return (
    <div data-testid="entries-page">
      <h1>Writing Entries</h1>
      {error && <div data-testid="entries-error">{error}</div>}
      <div data-testid="add-entry-form">
        <select data-testid="entry-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="entry-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="entry-wordcount" type="number" value={wordCount} placeholder="Word count" onChange={(e) => setWordCount(e.target.value)} />
        <input data-testid="entry-notes" value={notes} placeholder="Notes" onChange={(e) => setNotes(e.target.value)} />
        <button data-testid="add-entry-btn" onClick={add}>Add Entry</button>
      </div>
      {entries.length === 0 ? (
        <div data-testid="no-entries">No entries yet</div>
      ) : (
        <ul data-testid="entries-list">
          {entries.map((e) => (
            <li key={e.id} data-testid={`entry-${e.id}`}>
              <span data-testid={`entry-project-${e.id}`}>{projectMap[e.projectId] ?? e.projectId}</span>
              <span data-testid={`entry-words-${e.id}`}>{e.wordCount}</span>
              <span data-testid={`entry-date-${e.id}`}>{e.date}</span>
              <button data-testid={`delete-entry-${e.id}`} onClick={() => del(e.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
