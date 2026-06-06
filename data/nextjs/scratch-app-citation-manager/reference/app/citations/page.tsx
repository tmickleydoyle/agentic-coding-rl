import React, { useState, useEffect } from "react";
import { Citation, CitationType } from "../../lib/types";

const TYPES: CitationType[] = ["article", "book", "website", "other"];

export function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState<CitationType>("article");
  const [url, setUrl] = useState("");
  const [collection, setCollection] = useState("");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => fetch("/api/citations").then((r) => r.json()).then((d) => setCitations(d.citations ?? []));
  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(""); setAuthors(""); setYear(""); setType("article"); setUrl(""); setCollection(""); setNotes(""); setEditId(null); setError(""); };

  const submit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    const body = { title: title.trim(), authors, year, type, url, collection, notes };
    if (editId) {
      await fetch(`/api/citations?id=${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/citations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    reset(); load();
  };

  const startEdit = (c: Citation) => {
    setEditId(c.id); setTitle(c.title); setAuthors(c.authors); setYear(c.year);
    setType(c.type); setUrl(c.url); setCollection(c.collection); setNotes(c.notes);
  };

  const del = async (id: string) => { await fetch(`/api/citations?id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div data-testid="citations-page">
      <h1>Citations</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="citation-form">
        <input data-testid="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="input-authors" placeholder="Authors" value={authors} onChange={(e) => setAuthors(e.target.value)} />
        <input data-testid="input-year" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <select data-testid="input-type" value={type} onChange={(e) => setType(e.target.value as CitationType)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input data-testid="input-url" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input data-testid="input-collection" placeholder="Collection" value={collection} onChange={(e) => setCollection(e.target.value)} />
        <textarea data-testid="input-notes" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button data-testid="btn-submit" onClick={submit}>{editId ? "Update" : "Add Citation"}</button>
        {editId && <button data-testid="btn-cancel" onClick={reset}>Cancel</button>}
      </div>
      <ul data-testid="citations-list">
        {citations.map((c) => (
          <li key={c.id} data-testid={`citation-item-${c.id}`}>
            <span data-testid={`citation-title-${c.id}`}>{c.title}</span>
            <span data-testid={`citation-authors-${c.id}`}>{c.authors}</span>
            <span data-testid={`citation-type-${c.id}`}>{c.type}</span>
            <button data-testid={`btn-edit-${c.id}`} onClick={() => startEdit(c)}>Edit</button>
            <button data-testid={`btn-delete-${c.id}`} onClick={() => del(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
