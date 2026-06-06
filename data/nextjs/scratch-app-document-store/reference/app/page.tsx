import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Document, Folder } from "../lib/types";

function DashboardPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  useEffect(() => {
    fetch("/api/documents?resource=documents").then((r) => r.json()).then(setDocs);
    fetch("/api/documents?resource=folders").then((r) => r.json()).then(setFolders);
  }, []);
  return (
    <div data-testid="dashboard-page">
      <h1>Document Store</h1>
      <div data-testid="doc-count">{docs.length}</div>
      <div data-testid="folder-count">{folders.length}</div>
    </div>
  );
}

function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState("");
  const [tags, setTags] = useState("");

  const load = () => {
    fetch("/api/documents?resource=documents").then((r) => r.json()).then(setDocs);
    fetch("/api/documents?resource=folders").then((r) => r.json()).then(setFolders);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!title) return;
    const tagArr = tags ? tags.split(",").map((t) => t.trim()) : [];
    await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "documents", title, description, url, folderId, tags: tagArr, shared: false, createdAt: new Date().toISOString().slice(0, 10) }),
    });
    setTitle(""); setDescription(""); setUrl(""); setFolderId(""); setTags("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/documents?id=${id}&resource=documents`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="documents-page">
      <h1>Documents</h1>
      <input data-testid="doc-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input data-testid="doc-description-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input data-testid="doc-url-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <select data-testid="doc-folder-select" value={folderId} onChange={(e) => setFolderId(e.target.value)}>
        <option value="">No Folder</option>
        {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <input data-testid="doc-tags-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
      <button data-testid="add-doc-btn" onClick={handleAdd}>Add Document</button>
      <ul data-testid="doc-list">
        {docs.map((d) => (
          <li key={d.id} data-testid={`doc-item-${d.id}`}>
            <span data-testid={`doc-title-${d.id}`}>{d.title}</span>
            <span data-testid={`doc-shared-${d.id}`}>{d.shared ? "shared" : "private"}</span>
            <button data-testid={`remove-doc-${d.id}`} onClick={() => handleRemove(d.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");

  const load = () => fetch("/api/documents?resource=folders").then((r) => r.json()).then(setFolders);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "folders", name, color }),
    });
    setName(""); setColor("blue");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/documents?id=${id}&resource=folders`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="folders-page">
      <h1>Folders</h1>
      <input data-testid="folder-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Folder Name" />
      <input data-testid="folder-color-input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" />
      <button data-testid="add-folder-btn" onClick={handleAdd}>Add Folder</button>
      <ul data-testid="folder-list">
        {folders.map((f) => (
          <li key={f.id} data-testid={`folder-item-${f.id}`}>
            <span data-testid={`folder-name-${f.id}`}>{f.name}</span>
            <button data-testid={`remove-folder-${f.id}`} onClick={() => handleRemove(f.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SharedPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  useEffect(() => {
    fetch("/api/documents?resource=documents").then((r) => r.json()).then((all: Document[]) => setDocs(all.filter((d) => d.shared)));
  }, []);
  return (
    <div data-testid="shared-page">
      <h1>Shared Documents</h1>
      <ul data-testid="shared-list">
        {docs.map((d) => (
          <li key={d.id} data-testid={`shared-item-${d.id}`}>
            <span data-testid={`shared-title-${d.id}`}>{d.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Document[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`/api/documents?resource=search&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div data-testid="search-page">
      <h1>Search</h1>
      <input data-testid="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or tag" />
      <button data-testid="search-btn" onClick={handleSearch}>Search</button>
      <ul data-testid="search-results">
        {results.map((d) => (
          <li key={d.id} data-testid={`search-result-${d.id}`}>
            <span data-testid={`search-title-${d.id}`}>{d.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <DashboardPage />}
      {route === "/documents" && <DocumentsPage />}
      {route === "/folders" && <FoldersPage />}
      {route === "/shared" && <SharedPage />}
      {route === "/search" && <SearchPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
