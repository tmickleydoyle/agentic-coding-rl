import React, { useState } from "react";

type Tag = "security" | "todo" | "gotcha" | "performance" | "note";

interface CodeNote {
  id: number;
  file: string;
  module: string;
  tag: Tag;
  body: string;
  createdAt: string;
}

const SEED_NOTES: CodeNote[] = [
  {
    id: 5,
    file: "src/workers/email.ts",
    module: "workers",
    tag: "todo",
    body: "Email queue retries up to 3 times with exponential backoff.",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    file: "src/utils/cache.ts",
    module: "utils",
    tag: "performance",
    body: "LRU cache size is capped at 500 entries; tune via CACHE_MAX env var.",
    createdAt: "2024-01-18",
  },
  {
    id: 3,
    file: "src/api/users.ts",
    module: "api",
    tag: "gotcha",
    body: "User ID is a UUID string, not an integer — do not cast to Number.",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    file: "src/db/migrations.ts",
    module: "database",
    tag: "todo",
    body: "Migration runner does not support rollbacks yet. Add rollback support before v2.",
    createdAt: "2024-01-12",
  },
  {
    id: 1,
    file: "src/auth/login.ts",
    module: "auth",
    tag: "security",
    body: "Rate limiting applied to login endpoint — max 5 attempts per minute.",
    createdAt: "2024-01-10",
  },
];

const ALL_TAGS: Tag[] = ["security", "todo", "gotcha", "performance", "note"];

export default function App() {
  const [notes, setNotes] = useState<CodeNote[]>(SEED_NOTES);
  const [file, setFile] = useState("");
  const [module, setModule] = useState("");
  const [tag, setTag] = useState<Tag | "">("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<Tag | "all">("all");
  const [search, setSearch] = useState("");
  const [nextId, setNextId] = useState(6);

  function handleAdd() {
    if (
      !file.trim() ||
      !module.trim() ||
      !tag ||
      !body.trim()
    ) {
      setError("All fields are required.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newNote: CodeNote = {
      id: nextId,
      file: file.trim(),
      module: module.trim(),
      tag: tag as Tag,
      body: body.trim(),
      createdAt: today,
    };
    setNotes([newNote, ...notes]);
    setNextId(nextId + 1);
    setFile("");
    setModule("");
    setTag("");
    setBody("");
    setError("");
  }

  function handleDelete(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  const filtered = notes.filter((n) => {
    const matchTag = activeFilter === "all" || n.tag === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q || n.file.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  return (
    <main>
      <h1>Codebase Notes</h1>

      <section aria-label="Add note form">
        <div>
          <label htmlFor="note-file">File</label>
          <input
            id="note-file"
            data-testid="input-file"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            placeholder="src/path/to/file.ts"
          />
        </div>
        <div>
          <label htmlFor="note-module">Module</label>
          <input
            id="note-module"
            data-testid="input-module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder="module name"
          />
        </div>
        <div>
          <label htmlFor="note-tag">Tag</label>
          <select
            id="note-tag"
            data-testid="input-tag"
            value={tag}
            onChange={(e) => setTag(e.target.value as Tag | "")}
          >
            <option value="">-- select tag --</option>
            {ALL_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="note-body">Body</label>
          <textarea
            id="note-body"
            data-testid="input-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note here..."
          />
        </div>
        {error && <p data-testid="form-error">{error}</p>}
        <button data-testid="btn-add" onClick={handleAdd}>
          Add Note
        </button>
      </section>

      <section aria-label="Filter and search">
        <div>
          <button
            data-testid="filter-all"
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              data-testid={`filter-${t}`}
              aria-pressed={activeFilter === t}
              onClick={() => setActiveFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="search-notes">Search notes</label>
          <input
            id="search-notes"
            data-testid="input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file or body..."
          />
        </div>
      </section>

      <section aria-label="Notes list">
        {filtered.length === 0 ? (
          <p data-testid="empty-message">No notes found.</p>
        ) : (
          filtered.map((n) => (
            <div key={n.id} data-testid={`note-card-${n.id}`}>
              <span data-testid={`note-file-${n.id}`}>{n.file}</span>
              <span data-testid={`note-module-${n.id}`}>{n.module}</span>
              <span data-testid={`note-tag-${n.id}`}>{n.tag}</span>
              <p data-testid={`note-body-${n.id}`}>{n.body}</p>
              <span data-testid={`note-date-${n.id}`}>{n.createdAt}</span>
              <button
                data-testid={`btn-delete-${n.id}`}
                onClick={() => handleDelete(n.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
