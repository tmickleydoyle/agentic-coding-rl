"use client";
import React, { useState } from "react";

interface Entry {
  id: number;
  project: string;
  date: string;
  hours: number;
  description: string;
}

const SEED_ENTRIES: Entry[] = [
  { id: 1, project: "Website Redesign", date: "2024-01-15", hours: 3, description: "Homepage layout" },
  { id: 2, project: "Mobile App", date: "2024-01-15", hours: 5, description: "Auth flow implementation" },
  { id: 3, project: "Website Redesign", date: "2024-01-16", hours: 2, description: "Navigation component" },
  { id: 4, project: "API Integration", date: "2024-01-16", hours: 4, description: "REST endpoints" },
  { id: 5, project: "Mobile App", date: "2024-01-17", hours: 6, description: "Push notifications" },
];

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES);
  const [nextId, setNextId] = useState(6);
  const [filterProject, setFilterProject] = useState("All Projects");

  const [formProject, setFormProject] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formHours, setFormHours] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const uniqueProjects: string[] = [];
  entries.forEach((e) => {
    if (!uniqueProjects.includes(e.project)) uniqueProjects.push(e.project);
  });

  const filteredEntries =
    filterProject === "All Projects" ? entries : entries.filter((e) => e.project === filterProject);

  function handleLog() {
    const h = parseFloat(formHours);
    if (!formProject.trim() || isNaN(h) || h <= 0) return;
    setEntries((prev) => [
      ...prev,
      { id: nextId, project: formProject.trim(), date: formDate, hours: h, description: formDescription.trim() },
    ]);
    setNextId((n) => n + 1);
    setFormProject("");
    setFormDate("");
    setFormHours("");
    setFormDescription("");
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 800 }}>
      <h1 data-testid="page-heading">Project Hours</h1>

      <p data-testid="total-hours">Total: {totalHours} hrs</p>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="filter-project">Filter by project: </label>
        <select
          id="filter-project"
          data-testid="filter-project"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
        >
          <option value="All Projects">All Projects</option>
          {uniqueProjects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div data-testid="log-form" style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
        <div>
          <label htmlFor="form-project">Project</label>
          <input
            id="form-project"
            data-testid="form-project"
            value={formProject}
            onChange={(e) => setFormProject(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="form-date">Date</label>
          <input
            id="form-date"
            data-testid="form-date"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="form-hours">Hours</label>
          <input
            id="form-hours"
            data-testid="form-hours"
            type="number"
            value={formHours}
            onChange={(e) => setFormHours(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="form-description">Description</label>
          <textarea
            id="form-description"
            data-testid="form-description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <button data-testid="log-btn" onClick={handleLog} style={{ marginTop: 8 }}>Log</button>
      </div>

      {filteredEntries.length === 0 ? (
        <p data-testid="empty-state">No entries found.</p>
      ) : (
        <ul data-testid="entries-list" style={{ listStyle: "none", padding: 0 }}>
          {filteredEntries.map((e) => (
            <li key={e.id} data-testid={`entry-row-${e.id}`} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
              <span data-testid={`entry-project-${e.id}`} style={{ fontWeight: "bold", marginRight: 8 }}>{e.project}</span>
              <span data-testid={`entry-date-${e.id}`} style={{ marginRight: 8 }}>{e.date}</span>
              <span data-testid={`entry-hours-${e.id}`} style={{ marginRight: 8 }}>{e.hours} hrs</span>
              <span data-testid={`entry-description-${e.id}`} style={{ marginRight: 8 }}>{e.description}</span>
              <button data-testid={`delete-entry-${e.id}`} onClick={() => handleDelete(e.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <section data-testid="project-totals" style={{ marginTop: 24 }}>
        <h2>Project Totals</h2>
        {uniqueProjects.map((p) => {
          const total = entries.filter((e) => e.project === p).reduce((s, e) => s + e.hours, 0);
          return (
            <div key={p} data-testid={`project-total-${p.replace(/\s+/g, "-")}`}>
              {p}: {total} hrs
            </div>
          );
        })}
      </section>
    </main>
  );
}
