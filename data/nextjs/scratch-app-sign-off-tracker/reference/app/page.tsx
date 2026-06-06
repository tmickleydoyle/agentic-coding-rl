import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { SignOffItem } from "../lib/types";

function DashboardPage() {
  const [items, setItems] = useState<SignOffItem[]>([]);
  useEffect(() => {
    fetch("/api/signoffs").then((r) => r.json()).then(setItems);
  }, []);

  const complete = items.filter((i) => i.status === "Complete").length;
  const inProgress = items.filter((i) => i.status === "In Progress").length;
  const pending = items.filter((i) => i.status === "Pending").length;

  return (
    <div data-testid="dashboard-page">
      <h1>Sign-off Tracker</h1>
      <div data-testid="stat-total">Total: {items.length}</div>
      <div data-testid="stat-complete">Complete: {complete}</div>
      <div data-testid="stat-in-progress">In Progress: {inProgress}</div>
      <div data-testid="stat-pending">Pending: {pending}</div>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [items, setItems] = useState<SignOffItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/signoffs").then((r) => r.json()).then(setItems);
  }, []);

  const filtered = items.filter(
    (i) => statusFilter === "All" || i.status === statusFilter
  );

  return (
    <div data-testid="list-page">
      <h2>Sign-offs</h2>
      <select data-testid="filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Complete">Complete</option>
      </select>
      <button data-testid="add-signoff-btn" onClick={() => navigate({ name: "add" })}>New Sign-off</button>
      {filtered.length === 0 ? (
        <div data-testid="no-items">No sign-off items found</div>
      ) : (
        <ul data-testid="signoff-list">
          {filtered.map((i) => (
            <li key={i.id} data-testid={`signoff-item-${i.id}`}>
              <button data-testid={`signoff-link-${i.id}`} onClick={() => navigate({ name: "detail", id: i.id })}>
                {i.title}
              </button>
              <span data-testid={`signoff-status-${i.id}`}>{i.status}</span>
              <span data-testid={`signoff-progress-${i.id}`}>{i.signed.length}/{i.signers.length}</span>
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
  const [signersText, setSignersText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    const signers = signersText.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    if (signers.length === 0) errs.push("At least one signer is required");
    if (errs.length > 0) { setErrors(errs); return; }
    await fetch("/api/signoffs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, signers, dueDate }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>New Sign-off</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea data-testid="input-signers" value={signersText} onChange={(e) => setSignersText(e.target.value)} placeholder="Comma-separated signers" />
        <input data-testid="input-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        {errors.length > 0 && (
          <ul data-testid="form-errors">
            {errors.map((err, i) => <li key={i} data-testid={`form-error-${i}`}>{err}</li>)}
          </ul>
        )}
        <button type="submit" data-testid="submit-btn">Create</button>
        <button type="button" data-testid="cancel-btn" onClick={() => navigate({ name: "list" })}>Cancel</button>
      </form>
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [item, setItem] = useState<SignOffItem | null | undefined>(undefined);

  const load = () => {
    fetch("/api/signoffs")
      .then((r) => r.json())
      .then((data: SignOffItem[]) => setItem(data.find((i) => i.id === id) ?? null));
  };

  useEffect(load, [id]);

  const handleSign = async (signer: string) => {
    await fetch("/api/signoffs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, signer }),
    });
    load();
  };

  if (item === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (item === null) return <div data-testid="detail-not-found">Item not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{item.title}</h2>
      <div data-testid="detail-status">{item.status}</div>
      <div data-testid="detail-due-date">{item.dueDate}</div>
      <ul data-testid="signer-list">
        {item.signers.map((signer) => {
          const isSigned = item.signed.includes(signer);
          return (
            <li key={signer} data-testid={`signer-${signer.replace(/\s+/g, "-")}`}>
              <input
                type="checkbox"
                data-testid={`checkbox-${signer.replace(/\s+/g, "-")}`}
                checked={isSigned}
                readOnly={isSigned}
                onChange={() => { if (!isSigned) handleSign(signer); }}
              />
              <span>{signer}</span>
            </li>
          );
        })}
      </ul>
      <button data-testid="back-btn" onClick={() => navigate({ name: "list" })}>Back</button>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route.name === "dashboard" && <DashboardPage />}
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
