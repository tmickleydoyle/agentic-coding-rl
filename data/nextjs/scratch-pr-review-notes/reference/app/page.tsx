import React, { useState } from "react";

type Category = "bug" | "suggestion" | "nit";

interface Note {
  id: number;
  author: string;
  pr_number: number;
  note: string;
  category: Category;
  resolved: boolean;
}

const SEED: Note[] = [
  { id: 1, author: "alice", pr_number: 42, note: "Missing error handling in fetch calls", category: "bug", resolved: false },
  { id: 2, author: "bob", pr_number: 42, note: "Consider extracting this into a hook", category: "suggestion", resolved: false },
  { id: 3, author: "carol", pr_number: 55, note: "Unused import on line 12", category: "nit", resolved: true },
  { id: 4, author: "alice", pr_number: 55, note: "This function is too long, refactor it", category: "suggestion", resolved: false },
  { id: 5, author: "dave", pr_number: 67, note: "Security: sanitize user input", category: "bug", resolved: false },
  { id: 6, author: "carol", pr_number: 67, note: "Typo in variable name: `usesr` -> `user`", category: "nit", resolved: true },
];

const CATEGORY_COLORS: Record<Category, string> = {
  bug: "#ef4444",
  suggestion: "#3b82f6",
  nit: "#a855f7",
};

type FilterType = "all" | Category;

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED);
  const [filter, setFilter] = useState<FilterType>("all");
  const [nextId, setNextId] = useState(7);

  const [author, setAuthor] = useState("");
  const [prNumber, setPrNumber] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [category, setCategory] = useState<Category>("bug");

  const handleAdd = () => {
    if (!author.trim() || !noteText.trim()) return;
    const newNote: Note = {
      id: nextId,
      author: author.trim(),
      pr_number: prNumber,
      note: noteText.trim(),
      category,
      resolved: false,
    };
    setNotes((prev) => [...prev, newNote]);
    setNextId((n) => n + 1);
    setAuthor("");
    setPrNumber(0);
    setNoteText("");
    setCategory("bug");
  };

  const handleToggleResolve = (id: number) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, resolved: !n.resolved } : n));
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = filter === "all" ? notes : notes.filter((n) => n.category === filter);

  const total = notes.length;
  const resolved = notes.filter((n) => n.resolved).length;
  const unresolved = total - resolved;

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>PR Review Notes</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <span data-testid="stat-total">Total: {total}</span>
        <span data-testid="stat-resolved">Resolved: {resolved}</span>
        <span data-testid="stat-unresolved">Unresolved: {unresolved}</span>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        <button data-testid="filter-bug" onClick={() => setFilter("bug")}>Bug</button>
        <button data-testid="filter-suggestion" onClick={() => setFilter("suggestion")}>Suggestion</button>
        <button data-testid="filter-nit" onClick={() => setFilter("nit")}>Nit</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          data-testid="input-author"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          data-testid="input-pr-number"
          type="number"
          value={prNumber}
          onChange={(e) => setPrNumber(Number(e.target.value))}
        />
        <textarea
          data-testid="input-note"
          placeholder="Note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <select
          data-testid="select-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="bug">bug</option>
          <option value="suggestion">suggestion</option>
          <option value="nit">nit</option>
        </select>
        <button data-testid="btn-add-note" onClick={handleAdd}>Add Note</button>
      </div>

      <div>
        {filtered.map((n) => (
          <div
            key={n.id}
            data-testid={`note-card-${n.id}`}
            style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "0.75rem", marginBottom: "0.5rem" }}
          >
            <div>
              <strong>{n.author}</strong> — PR{" "}
              <span data-testid={`pr-number-${n.id}`}>{n.pr_number}</span>
            </div>
            <div data-testid={`note-text-${n.id}`}>{n.note}</div>
            <div>
              <span
                data-testid={`category-badge-${n.id}`}
                style={{ background: CATEGORY_COLORS[n.category], color: "#fff", padding: "2px 6px", borderRadius: "4px" }}
              >
                {n.category}
              </span>
              {n.resolved && (
                <span data-testid={`resolved-indicator-${n.id}`} style={{ marginLeft: "0.5rem", color: "#22c55e" }}>
                  Resolved
                </span>
              )}
            </div>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button data-testid={`btn-resolve-${n.id}`} onClick={() => handleToggleResolve(n.id)}>
                {n.resolved ? "Unresolve" : "Resolve"}
              </button>
              <button data-testid={`btn-delete-${n.id}`} onClick={() => handleDelete(n.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
