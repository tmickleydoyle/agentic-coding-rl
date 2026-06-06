import React, { useState } from "react";

interface Project {
  id: number;
  title: string;
  type: string;
  startDate: string;
  notes: string;
  progress: number;
}

const SEED: Project[] = [
  { id: 1, title: "Macrame Wall Hanging", type: "Macrame", startDate: "2024-01-10", notes: "Using natural cotton cord", progress: 40 },
  { id: 2, title: "Embroidered Tote Bag", type: "Embroidery", startDate: "2024-02-03", notes: "Floral design pattern", progress: 70 },
  { id: 3, title: "Crochet Amigurumi", type: "Crochet", startDate: "2024-03-15", notes: "Bunny character", progress: 20 },
  { id: 4, title: "Felt Flower Wreath", type: "Felting", startDate: "2024-04-01", notes: "Spring colors", progress: 90 },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(SEED);
  const [nextId, setNextId] = useState(5);

  const [inputTitle, setInputTitle] = useState("");
  const [inputType, setInputType] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputNotes, setInputNotes] = useState("");
  const [inputProgress, setInputProgress] = useState("");

  const [editProgress, setEditProgress] = useState<Record<number, string>>({});

  const handleAdd = () => {
    if (!inputTitle.trim()) return;
    let prog = parseInt(inputProgress, 10);
    if (isNaN(prog)) prog = 0;
    prog = Math.min(100, Math.max(0, prog));
    const newProject: Project = {
      id: nextId,
      title: inputTitle.trim(),
      type: inputType.trim(),
      startDate: inputDate || today(),
      notes: inputNotes.trim(),
      progress: prog,
    };
    setProjects((prev) => [...prev, newProject]);
    setNextId((n) => n + 1);
    setInputTitle("");
    setInputType("");
    setInputDate("");
    setInputNotes("");
    setInputProgress("");
  };

  const handleUpdate = (id: number) => {
    const val = parseInt(editProgress[id] ?? "", 10);
    if (isNaN(val)) return;
    const clamped = Math.min(100, Math.max(0, val));
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress: clamped } : p))
    );
  };

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const displayed = [...projects].sort((a, b) => {
    if (sortOrder === "asc") return a.progress - b.progress;
    if (sortOrder === "desc") return b.progress - a.progress;
    return 0;
  });

  const avg =
    projects.length === 0
      ? 0
      : Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <div>
      <h1>WIP Project Tracker</h1>

      <div>
        <label htmlFor="input-title">Title</label>
        <input
          id="input-title"
          data-testid="input-title"
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <label htmlFor="input-type">Type</label>
        <input
          id="input-type"
          data-testid="input-type"
          type="text"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        />
        <label htmlFor="input-date">Start Date</label>
        <input
          id="input-date"
          data-testid="input-date"
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
        />
        <label htmlFor="input-notes">Notes</label>
        <textarea
          id="input-notes"
          data-testid="input-notes"
          value={inputNotes}
          onChange={(e) => setInputNotes(e.target.value)}
        />
        <label htmlFor="input-progress">Progress %</label>
        <input
          id="input-progress"
          data-testid="input-progress"
          type="number"
          value={inputProgress}
          onChange={(e) => setInputProgress(e.target.value)}
        />
        <button data-testid="btn-add" onClick={handleAdd}>
          Add Project
        </button>
      </div>

      <div>
        <button data-testid="sort-asc" onClick={() => setSortOrder("asc")}>
          Sort by Progress Asc
        </button>
        <button data-testid="sort-desc" onClick={() => setSortOrder("desc")}>
          Sort by Progress Desc
        </button>
      </div>

      <div data-testid="avg-progress">Average: {avg}%</div>

      {projects.length === 0 ? (
        <div data-testid="empty-msg">No projects yet</div>
      ) : (
        <div>
          {displayed.map((p) => (
            <div key={p.id} data-testid={`project-${p.id}`}>
              <span data-testid={`project-title-${p.id}`}>{p.title}</span>
              <span data-testid={`project-type-${p.id}`}>{p.type}</span>
              <span data-testid={`project-date-${p.id}`}>{p.startDate}</span>
              <span data-testid={`project-notes-${p.id}`}>{p.notes}</span>
              <span data-testid={`project-progress-${p.id}`}>{p.progress}%</span>
              <input
                data-testid={`edit-progress-${p.id}`}
                type="number"
                value={editProgress[p.id] ?? p.progress}
                onChange={(e) =>
                  setEditProgress((prev) => ({ ...prev, [p.id]: e.target.value }))
                }
              />
              <button
                data-testid={`btn-update-${p.id}`}
                onClick={() => handleUpdate(p.id)}
              >
                Update
              </button>
              <button
                data-testid={`btn-delete-${p.id}`}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
