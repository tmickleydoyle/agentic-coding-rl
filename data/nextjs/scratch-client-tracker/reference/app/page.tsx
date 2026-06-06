"use client";
import React, { useState } from "react";

type Status = "active" | "inactive" | "prospect";

interface Client {
  id: number;
  name: string;
  email: string;
  status: Status;
  rate: number;
  notes: string;
}

const SEED_CLIENTS: Client[] = [
  { id: 1, name: "Acme Corp", email: "contact@acme.com", status: "active", rate: 120, notes: "Long-term retainer" },
  { id: 2, name: "Beta Studio", email: "hello@betastudio.com", status: "active", rate: 95, notes: "UI design work" },
  { id: 3, name: "Gamma LLC", email: "info@gammallc.com", status: "inactive", rate: 80, notes: "Project on hold" },
  { id: 4, name: "Delta Partners", email: "dp@deltapartners.com", status: "prospect", rate: 110, notes: "Proposal sent" },
];

type FilterType = "All" | Status;

const FILTERS: FilterType[] = ["All", "active", "inactive", "prospect"];

export default function App() {
  const [clients, setClients] = useState<Client[]>(SEED_CLIENTS);
  const [filter, setFilter] = useState<FilterType>("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(5);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<Status>("active");
  const [formRate, setFormRate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const filtered = filter === "All" ? clients : clients.filter((c) => c.status === filter);

  function openAdd() {
    setEditId(null);
    setFormName("");
    setFormEmail("");
    setFormStatus("active");
    setFormRate("");
    setFormNotes("");
    setShowForm(true);
  }

  function openEdit(client: Client) {
    setEditId(client.id);
    setFormName(client.name);
    setFormEmail(client.email);
    setFormStatus(client.status);
    setFormRate(String(client.rate));
    setFormNotes(client.notes);
    setShowForm(true);
  }

  function handleSave() {
    if (!formName.trim() || !formEmail.trim()) return;
    const rate = parseFloat(formRate) || 0;
    if (editId !== null) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editId
            ? { ...c, name: formName.trim(), email: formEmail.trim(), status: formStatus, rate, notes: formNotes.trim() }
            : c
        )
      );
    } else {
      setClients((prev) => [
        ...prev,
        { id: nextId, name: formName.trim(), email: formEmail.trim(), status: formStatus, rate, notes: formNotes.trim() },
      ]);
      setNextId((n) => n + 1);
    }
    setShowForm(false);
    setEditId(null);
  }

  function handleDelete(id: number) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function handleCancel() {
    setShowForm(false);
    setEditId(null);
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 800 }}>
      <h1 data-testid="page-heading">Client Tracker</h1>

      <div data-testid="filter-bar" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            data-testid={`filter-${f}`}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal", textDecoration: filter === f ? "underline" : "none" }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <p data-testid="client-count">{filtered.length} client{filtered.length !== 1 ? "s" : ""}</p>

      <button data-testid="add-client-btn" onClick={openAdd} style={{ marginBottom: 16 }}>
        Add Client
      </button>

      {showForm && (
        <div data-testid="client-form" style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
          <div>
            <label htmlFor="form-name">Name</label>
            <input
              id="form-name"
              data-testid="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label htmlFor="form-email">Email</label>
            <input
              id="form-email"
              data-testid="form-email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label htmlFor="form-status">Status</label>
            <select
              id="form-status"
              data-testid="form-status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as Status)}
              style={{ marginLeft: 8 }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>
          <div>
            <label htmlFor="form-rate">Rate ($/hr)</label>
            <input
              id="form-rate"
              data-testid="form-rate"
              type="number"
              value={formRate}
              onChange={(e) => setFormRate(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label htmlFor="form-notes">Notes</label>
            <textarea
              id="form-notes"
              data-testid="form-notes"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button data-testid="form-save" onClick={handleSave}>Save</button>
            <button data-testid="form-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p data-testid="empty-state">No clients found.</p>
      ) : (
        <ul data-testid="client-list" style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((c) => (
            <li key={c.id} data-testid={`client-row-${c.id}`} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <span data-testid={`client-name-${c.id}`} style={{ fontWeight: "bold", marginRight: 8 }}>{c.name}</span>
              <span data-testid={`client-email-${c.id}`} style={{ marginRight: 8 }}>{c.email}</span>
              <span data-testid={`client-status-${c.id}`} style={{ marginRight: 8 }}>[{c.status}]</span>
              <span data-testid={`client-rate-${c.id}`} style={{ marginRight: 8 }}>${c.rate}/hr</span>
              <span data-testid={`client-notes-${c.id}`} style={{ marginRight: 8 }}>{c.notes}</span>
              <button data-testid={`edit-btn-${c.id}`} onClick={() => openEdit(c)} style={{ marginRight: 4 }}>Edit</button>
              <button data-testid={`delete-btn-${c.id}`} onClick={() => handleDelete(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
