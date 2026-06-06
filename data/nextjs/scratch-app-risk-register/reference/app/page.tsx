import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { Risk, RiskCategory, RiskStatus } from "../lib/types";

function DashboardPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  useEffect(() => {
    fetch("/api/risks").then((r) => r.json()).then(setRisks);
  }, []);

  const openRisks = risks.filter((r) => r.status === "Open");
  const avgScore =
    openRisks.length > 0
      ? openRisks.reduce((s, r) => s + r.likelihood * r.impact, 0) / openRisks.length
      : 0;

  let highest: Risk | null = null;
  risks.forEach((r) => {
    if (!highest || r.likelihood * r.impact > highest.likelihood * highest.impact) {
      highest = r;
    }
  });

  return (
    <div data-testid="dashboard-page">
      <h1>Risk Register</h1>
      <div data-testid="stat-total">Total Risks: {risks.length}</div>
      <div data-testid="stat-open">Open: {openRisks.length}</div>
      <div data-testid="stat-avg-score">Avg Open Score: {avgScore.toFixed(1)}</div>
      <div data-testid="stat-highest">{highest ? (highest as Risk).title : "None"}</div>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/risks").then((r) => r.json()).then(setRisks);
  }, []);

  const filtered = risks.filter(
    (r) =>
      (catFilter === "All" || r.category === catFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
  );

  return (
    <div data-testid="list-page">
      <h2>Risks</h2>
      <select data-testid="filter-category" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
        <option value="All">All Categories</option>
        <option value="Security">Security</option>
        <option value="Operational">Operational</option>
        <option value="Legal">Legal</option>
        <option value="Financial">Financial</option>
        <option value="Other">Other</option>
      </select>
      <select data-testid="filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Open">Open</option>
        <option value="Mitigated">Mitigated</option>
        <option value="Closed">Closed</option>
      </select>
      <button data-testid="add-risk-btn" onClick={() => navigate({ name: "add" })}>Add Risk</button>
      {filtered.length === 0 ? (
        <div data-testid="no-risks">No risks found</div>
      ) : (
        <ul data-testid="risk-list">
          {filtered.map((r) => (
            <li key={r.id} data-testid={`risk-item-${r.id}`}>
              <button data-testid={`risk-link-${r.id}`} onClick={() => navigate({ name: "detail", id: r.id })}>
                {r.title}
              </button>
              <span data-testid={`risk-score-${r.id}`}>{r.likelihood * r.impact}</span>
              <span data-testid={`risk-status-${r.id}`}>{r.status}</span>
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
  const [category, setCategory] = useState<RiskCategory>("Security");
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [status, setStatus] = useState<RiskStatus>("Open");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    await fetch("/api/risks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, likelihood, impact, status, owner, description }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>Add Risk</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select data-testid="input-category" value={category} onChange={(e) => setCategory(e.target.value as RiskCategory)}>
          <option value="Security">Security</option>
          <option value="Operational">Operational</option>
          <option value="Legal">Legal</option>
          <option value="Financial">Financial</option>
          <option value="Other">Other</option>
        </select>
        <input data-testid="input-likelihood" type="number" min={1} max={5} value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} />
        <input data-testid="input-impact" type="number" min={1} max={5} value={impact} onChange={(e) => setImpact(Number(e.target.value))} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as RiskStatus)}>
          <option value="Open">Open</option>
          <option value="Mitigated">Mitigated</option>
          <option value="Closed">Closed</option>
        </select>
        <input data-testid="input-owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <textarea data-testid="input-description" value={description} onChange={(e) => setDescription(e.target.value)} />
        {error && <div data-testid="form-error">{error}</div>}
        <button type="submit" data-testid="submit-btn">Save</button>
        <button type="button" data-testid="cancel-btn" onClick={() => navigate({ name: "list" })}>Cancel</button>
      </form>
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [risk, setRisk] = useState<Risk | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/risks")
      .then((r) => r.json())
      .then((data: Risk[]) => setRisk(data.find((r) => r.id === id) ?? null));
  }, [id]);

  if (risk === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (risk === null) return <div data-testid="detail-not-found">Risk not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{risk.title}</h2>
      <div data-testid="detail-category">{risk.category}</div>
      <div data-testid="detail-score">{risk.likelihood * risk.impact}</div>
      <div data-testid="detail-status">{risk.status}</div>
      <div data-testid="detail-owner">{risk.owner}</div>
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
