import React, { useState, useEffect } from "react";
import { ResearchNote } from "../../lib/types";

export function ResearchPage() {
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => setNotes(d.notes ?? []));
  };

  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(""); setContent(""); setTags(""); setSourceUrl(""); setEditId(null); setError(""); };

  const submit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    const body = { title: title.trim(), content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), sourceUrl };
    if (editId) {
      await fetch(`/api/notes?id=${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    reset();
    load();
  };

  const startEdit = (note: ResearchNote) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(", "));
    setSourceUrl(note.sourceUrl);
  };

  const del = async (id: string) => {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="research-page">
      <h1>Research Notes</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="note-form">
        <input data-testid="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea data-testid="input-content" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <input data-testid="input-tags" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input data-testid="input-source" placeholder="Source URL" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
        <button data-testid="btn-submit" onClick={submit}>{editId ? "Update" : "Add Note"}</button>
        {editId && <button data-testid="btn-cancel" onClick={reset}>Cancel</button>}
      </div>
      <ul data-testid="notes-list">
        {notes.map((n) => (
          <li key={n.id} data-testid={`note-item-${n.id}`}>
            <span data-testid={`note-title-${n.id}`}>{n.title}</span>
            <span data-testid={`note-content-${n.id}`}>{n.content}</span>
            <span data-testid={`note-tags-${n.id}`}>{n.tags.join(", ")}</span>
            <button data-testid={`btn-edit-${n.id}`} onClick={() => startEdit(n)}>Edit</button>
            <button data-testid={`btn-delete-${n.id}`} onClick={() => del(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
