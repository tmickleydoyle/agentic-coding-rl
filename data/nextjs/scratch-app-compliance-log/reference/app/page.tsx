import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { ComplianceLog, Regulation, Severity, LogStatus } from "../lib/types";

function DashboardPage() {
  const [logs, setLogs] = useState<ComplianceLog[]>([]);
  useEffect(() => {
    fetch("/api/logs").then((r) => r.json()).then(setLogs);
  }, []);
  const open = logs.filter((l) => l.status === "Open").length;
  const resolved = logs.filter((l) => l.status === "Resolved").length;
  const critical = logs.filter((l) => l.severity === "Critical").length;
  return (
    <div data-testid="dashboard-page">
      <h1>Compliance Log</h1>
      <div data-testid="stat-total">Total: {logs.length}</div>
      <div data-testid="stat-open">Open: {open}</div>
      <div data-testid="stat-resolved">Resolved: {resolved}</div>
      <div data-testid="stat-critical">Critical: {critical}</div>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [logs, setLogs] = useState<ComplianceLog[]>([]);
  const [regFilter, setRegFilter] = useState("All");
  const [sevFilter, setSevFilter] = useState("All");

  useEffect(() => {
    fetch("/api/logs").then((r) => r.json()).then(setLogs);
  }, []);

  const filtered = logs.filter(
    (l) =>
      (regFilter === "All" || l.regulation === regFilter) &&
      (sevFilter === "All" || l.severity === sevFilter)
  );

  return (
    <div data-testid="list-page">
      <h2>Compliance Logs</h2>
      <select data-testid="filter-regulation" value={regFilter} onChange={(e) => setRegFilter(e.target.value)}>
        <option value="All">All Regulations</option>
        <option value="GDPR">GDPR</option>
        <option value="SOX">SOX</option>
        <option value="HIPAA">HIPAA</option>
        <option value="PCI">PCI</option>
        <option value="Other">Other</option>
      </select>
      <select data-testid="filter-severity" value={sevFilter} onChange={(e) => setSevFilter(e.target.value)}>
        <option value="All">All Severities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <button data-testid="add-log-btn" onClick={() => navigate({ name: "add" })}>Add Entry</button>
      {filtered.length === 0 ? (
        <div data-testid="no-logs">No log entries found</div>
      ) : (
        <ul data-testid="log-list">
          {filtered.map((l) => (
            <li key={l.id} data-testid={`log-item-${l.id}`}>
              <button data-testid={`log-link-${l.id}`} onClick={() => navigate({ name: "detail", id: l.id })}>
                {l.title}
              </button>
              <span data-testid={`log-regulation-${l.id}`}>{l.regulation}</span>
              <span data-testid={`log-severity-${l.id}`}>{l.severity}</span>
              <span data-testid={`log-status-${l.id}`}>{l.status}</span>
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
  const [regulation, setRegulation] = useState<Regulation>("GDPR");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [status, setStatus] = useState<LogStatus>("Open");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, regulation, severity, status, date, notes }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>Add Compliance Entry</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <select data-testid="input-regulation" value={regulation} onChange={(e) => setRegulation(e.target.value as Regulation)}>
          <option value="GDPR">GDPR</option>
          <option value="SOX">SOX</option>
          <option value="HIPAA">HIPAA</option>
          <option value="PCI">PCI</option>
          <option value="Other">Other</option>
        </select>
        <select data-testid="input-severity" value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as LogStatus)}>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
        </select>
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {error && <div data-testid="form-error">{error}</div>}
        <button type="submit" data-testid="submit-btn">Save</button>
        <button type="button" data-testid="cancel-btn" onClick={() => navigate({ name: "list" })}>Cancel</button>
      </form>
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [log, setLog] = useState<ComplianceLog | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/logs")
      .then((r) => r.json())
      .then((data: ComplianceLog[]) => setLog(data.find((l) => l.id === id) ?? null));
  }, [id]);

  if (log === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (log === null) return <div data-testid="detail-not-found">Log entry not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{log.title}</h2>
      <div data-testid="detail-regulation">{log.regulation}</div>
      <div data-testid="detail-severity">{log.severity}</div>
      <div data-testid="detail-status">{log.status}</div>
      <div data-testid="detail-notes">{log.notes}</div>
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
