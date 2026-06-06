import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { Policy, Department, PolicyStatus } from "../lib/types";

function DashboardPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  useEffect(() => {
    fetch("/api/policies").then((r) => r.json()).then(setPolicies);
  }, []);

  const active = policies.filter((p) => p.status === "Active");
  const draft = policies.filter((p) => p.status === "Draft").length;
  const activeDepts = Array.from(new Set(active.map((p) => p.department)));

  return (
    <div data-testid="dashboard-page">
      <h1>Policy Manager</h1>
      <div data-testid="stat-total">Total: {policies.length}</div>
      <div data-testid="stat-active">Active: {active.length}</div>
      <div data-testid="stat-draft">Draft: {draft}</div>
      <div data-testid="stat-active-depts">Active Departments: {activeDepts.length}</div>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/policies").then((r) => r.json()).then(setPolicies);
  }, []);

  const filtered = policies.filter(
    (p) =>
      (deptFilter === "All" || p.department === deptFilter) &&
      (statusFilter === "All" || p.status === statusFilter)
  );

  return (
    <div data-testid="list-page">
      <h2>Policies</h2>
      <select data-testid="filter-department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
        <option value="All">All Departments</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
        <option value="Legal">Legal</option>
        <option value="Finance">Finance</option>
        <option value="Operations">Operations</option>
        <option value="Other">Other</option>
      </select>
      <select data-testid="filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="Archived">Archived</option>
      </select>
      <button data-testid="add-policy-btn" onClick={() => navigate({ name: "add" })}>Add Policy</button>
      {filtered.length === 0 ? (
        <div data-testid="no-policies">No policies found</div>
      ) : (
        <ul data-testid="policy-list">
          {filtered.map((p) => (
            <li key={p.id} data-testid={`policy-item-${p.id}`}>
              <button data-testid={`policy-link-${p.id}`} onClick={() => navigate({ name: "detail", id: p.id })}>
                {p.title}
              </button>
              <span data-testid={`policy-version-${p.id}`}>{p.version}</span>
              <span data-testid={`policy-status-${p.id}`}>{p.status}</span>
              <span data-testid={`policy-dept-${p.id}`}>{p.department}</span>
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
  const [department, setDepartment] = useState<Department>("IT");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState<PolicyStatus>("Draft");
  const [owner, setOwner] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!version.trim()) errs.push("Version is required");
    if (errs.length > 0) { setErrors(errs); return; }
    await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, department, version, status, owner, reviewDate, summary }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>Add Policy</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select data-testid="input-department" value={department} onChange={(e) => setDepartment(e.target.value as Department)}>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Legal">Legal</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
          <option value="Other">Other</option>
        </select>
        <input data-testid="input-version" value={version} onChange={(e) => setVersion(e.target.value)} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as PolicyStatus)}>
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
        <input data-testid="input-owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <input data-testid="input-review-date" type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
        <textarea data-testid="input-summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        {errors.length > 0 && (
          <ul data-testid="form-errors">
            {errors.map((err, i) => <li key={i} data-testid={`form-error-${i}`}>{err}</li>)}
          </ul>
        )}
        <button type="submit" data-testid="submit-btn">Save</button>
        <button type="button" data-testid="cancel-btn" onClick={() => navigate({ name: "list" })}>Cancel</button>
      </form>
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [policy, setPolicy] = useState<Policy | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/policies")
      .then((r) => r.json())
      .then((data: Policy[]) => setPolicy(data.find((p) => p.id === id) ?? null));
  }, [id]);

  if (policy === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (policy === null) return <div data-testid="detail-not-found">Policy not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{policy.title}</h2>
      <div data-testid="detail-version">{policy.version}</div>
      <div data-testid="detail-department">{policy.department}</div>
      <div data-testid="detail-status">{policy.status}</div>
      <div data-testid="detail-owner">{policy.owner}</div>
      <div data-testid="detail-summary">{policy.summary}</div>
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
