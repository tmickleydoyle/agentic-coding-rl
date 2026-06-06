import React, { useState } from "react";

type Priority = "high" | "medium" | "low";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  priority: Priority;
  archived: boolean;
}

const SEED_NOTES: Note[] = [
  { id: 1, title: "Opening Gambit", content: "Control center squares early", tags: ["chess", "opening"], priority: "high", archived: false },
  { id: 2, title: "Resource Management", content: "Never deplete wood before round 3", tags: ["settlers", "economy"], priority: "medium", archived: false },
  { id: 3, title: "Bluffing Tells", content: "Watch for eye contact breaks", tags: ["poker", "psychology"], priority: "high", archived: true },
  { id: 4, title: "Endgame Points", content: "Count victory points before final round", tags: ["general", "endgame"], priority: "low", archived: false },
];

let nextId = 5;

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<Priority>("medium");

  const totalNotes = notes.length;
  const archivedCount = notes.filter((n) => n.archived).length;
  const activeCount = totalNotes - archivedCount;

  const query = search.toLowerCase();
  const visibleNotes = notes.filter((n) => {
    if (!showArchived && n.archived) return false;
    if (query) {
      return n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query);
    }
    return true;
  });

  function handleAdd() {
    const trimTitle = titleInput.trim();
    const trimContent = contentInput.trim();
    if (!trimTitle || !trimContent) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const newNote: Note = {
      id: nextId++,
      title: trimTitle,
      content: trimContent,
      tags,
      priority: priorityInput,
      archived: false,
    };
    setNotes((prev) => [...prev, newNote]);
    setTitleInput("");
    setContentInput("");
    setTagsInput("");
    setPriorityInput("medium");
  }

  function handleArchiveToggle(id: number) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n))
    );
  }

  function handleDelete(id: number) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div>
      <h1>Strategy Notes</h1>

      <div>
        <span data-testid="total-notes">{totalNotes}</span>
        <span data-testid="active-notes">{activeCount}</span>
        <span data-testid="archived-notes">{archivedCount}</span>
      </div>

      <div>
        <input
          data-testid="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
        />
      </div>

      <div>
        <button
          data-testid="toggle-archived-btn"
          onClick={() => setShowArchived((prev) => !prev)}
        >
          {showArchived ? "Hide Archived" : "Show Archived"}
        </button>
      </div>

      <div>
        <input
          data-testid="note-title-input"
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Title"
        />
        <textarea
          data-testid="note-content-input"
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          placeholder="Content"
        />
        <input
          data-testid="note-tags-input"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Tags (comma-separated)"
        />
        <select
          data-testid="note-priority-input"
          value={priorityInput}
          onChange={(e) => setPriorityInput(e.target.value as Priority)}
        >
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <button data-testid="add-note-btn" onClick={handleAdd}>
          Add Note
        </button>
      </div>

      <div>
        {visibleNotes.map((note) => (
          <div key={note.id} data-testid={`note-card-${note.id}`}>
            <span data-testid={`note-title-${note.id}`}>{note.title}</span>
            <span data-testid={`note-content-${note.id}`}>{note.content}</span>
            <span data-testid={`note-priority-${note.id}`}>{note.priority}</span>
            <span data-testid={`note-archive-status-${note.id}`}>
              {note.archived ? "Archived" : "Active"}
            </span>
            <span data-testid={`note-tags-${note.id}`}>{note.tags.join(", ")}</span>
            <button
              data-testid={`archive-toggle-${note.id}`}
              onClick={() => handleArchiveToggle(note.id)}
            >
              {note.archived ? "Unarchive" : "Archive"}
            </button>
            <button
              data-testid={`delete-note-${note.id}`}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
