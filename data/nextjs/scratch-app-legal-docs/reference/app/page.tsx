import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { LegalDocument, Category, Status } from "../lib/types";

function HomePage() {
  const { navigate } = useApp();
  const [docs, setDocs] = useState<LegalDocument[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then(setDocs);
  }, []);

  const active = docs.filter((d) => d.status === "Active").length;
  const draft = docs.filter((d) => d.status === "Draft").length;

  return (
    <div data-testid="home-page">
      <h1>Legal Document Manager</h1>
      <div data-testid="stat-total">Total: {docs.length}</div>
      <div data-testid="stat-active">Active: {active}</div>
      <div data-testid="stat-draft">Draft: {draft}</div>
      <button data-testid="go-to-docs" onClick={() => navigate({ name: "list" })}>
        View Documents
      </button>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [docs, setDocs] = useState<LegalDocument[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then(setDocs);
  }, []);

  const filtered = docs.filter((d) => {
    return (
      (categoryFilter === "All" || d.category === categoryFilter) &&
      (statusFilter === "All" || d.status === statusFilter)
    );
  });

  return (
    <div data-testid="list-page">
      <h2>Documents</h2>
      <select
        data-testid="filter-category"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Contract">Contract</option>
        <option value="Policy">Policy</option>
        <option value="NDA">NDA</option>
        <option value="Other">Other</option>
      </select>
      <select
        data-testid="filter-status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="Archived">Archived</option>
      </select>
      <button data-testid="add-doc-btn" onClick={() => navigate({ name: "add" })}>
        Add Document
      </button>
      {filtered.length === 0 ? (
        <div data-testid="no-docs">No documents found</div>
      ) : (
        <ul data-testid="doc-list">
          {filtered.map((d) => (
            <li key={d.id} data-testid={`doc-item-${d.id}`}>
              <button
                data-testid={`doc-link-${d.id}`}
                onClick={() => navigate({ name: "detail", id: d.id })}
              >
                {d.title}
              </button>
              <span data-testid={`doc-category-${d.id}`}>{d.category}</span>
              <span data-testid={`doc-status-${d.id}`}>{d.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddPage() {
  const { navigate } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Contract");
  const [status, setStatus] = useState<Status>("Draft");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, status }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>Add Document</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <select
          data-testid="input-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="Contract">Contract</option>
          <option value="Policy">Policy</option>
          <option value="NDA">NDA</option>
          <option value="Other">Other</option>
        </select>
        <select
          data-testid="input-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
        {error && <div data-testid="form-error">{error}</div>}
        <button type="submit" data-testid="submit-btn">
          Save
        </button>
        <button type="button" data-testid="cancel-btn" onClick={() => navigate({ name: "list" })}>
          Cancel
        </button>
      </form>
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [doc, setDoc] = useState<LegalDocument | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((docs: LegalDocument[]) => {
        const found = docs.find((d) => d.id === id);
        setDoc(found ?? null);
      });
  }, [id]);

  if (doc === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (doc === null) return <div data-testid="detail-not-found">Document not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{doc.title}</h2>
      <div data-testid="detail-category">{doc.category}</div>
      <div data-testid="detail-status">{doc.status}</div>
      <div data-testid="detail-date">{doc.createdAt}</div>
      <button data-testid="back-btn" onClick={() => navigate({ name: "list" })}>
        Back
      </button>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route.name === "home" && <HomePage />}
      {route.name === "list" && <ListPage />}
      {route.name === "add" && <AddPage />}
      {route.name === "detail" && <DetailPage id={route.id} />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
