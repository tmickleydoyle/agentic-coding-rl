import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { Contract, ContractStatus } from "../lib/types";

function DashboardPage() {
  const { navigate } = useApp();
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch("/api/contracts").then((r) => r.json()).then(setContracts);
  }, []);

  const activeValue = contracts
    .filter((c) => c.status === "Active")
    .reduce((sum, c) => sum + c.value, 0);

  const byStatus: Record<string, number> = {};
  contracts.forEach((c) => {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
  });

  return (
    <div data-testid="dashboard-page">
      <h1>Contract Tracker</h1>
      <div data-testid="stat-total">Total Contracts: {contracts.length}</div>
      <div data-testid="stat-active-value">Active Value: {activeValue}</div>
      <div data-testid="stat-active-count">Active: {byStatus["Active"] ?? 0}</div>
      <div data-testid="stat-expired-count">Expired: {byStatus["Expired"] ?? 0}</div>
      <button data-testid="go-to-contracts" onClick={() => navigate({ name: "list" })}>
        View Contracts
      </button>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/contracts").then((r) => r.json()).then(setContracts);
  }, []);

  const filtered = contracts.filter(
    (c) => statusFilter === "All" || c.status === statusFilter
  );

  return (
    <div data-testid="list-page">
      <h2>Contracts</h2>
      <select
        data-testid="filter-status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Expired">Expired</option>
        <option value="Pending">Pending</option>
        <option value="Terminated">Terminated</option>
      </select>
      <button data-testid="add-contract-btn" onClick={() => navigate({ name: "add" })}>
        Add Contract
      </button>
      {filtered.length === 0 ? (
        <div data-testid="no-contracts">No contracts found</div>
      ) : (
        <ul data-testid="contract-list">
          {filtered.map((c) => (
            <li key={c.id} data-testid={`contract-item-${c.id}`}>
              <button
                data-testid={`contract-link-${c.id}`}
                onClick={() => navigate({ name: "detail", id: c.id })}
              >
                {c.title}
              </button>
              <span data-testid={`contract-party-${c.id}`}>{c.party}</span>
              <span data-testid={`contract-status-${c.id}`}>{c.status}</span>
              <span data-testid={`contract-value-${c.id}`}>{c.value}</span>
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
  const [party, setParty] = useState("");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<ContractStatus>("Active");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!party.trim()) errs.push("Party is required");
    if (!value || Number(value) <= 0) errs.push("Value must be greater than 0");
    if (errs.length > 0) { setErrors(errs); return; }
    await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, party, value: Number(value), startDate, endDate, status }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>Add Contract</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-party" value={party} onChange={(e) => setParty(e.target.value)} placeholder="Party" />
        <input data-testid="input-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" />
        <input data-testid="input-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input data-testid="input-end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as ContractStatus)}>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Pending">Pending</option>
          <option value="Terminated">Terminated</option>
        </select>
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
  const [contract, setContract] = useState<Contract | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/contracts")
      .then((r) => r.json())
      .then((data: Contract[]) => setContract(data.find((c) => c.id === id) ?? null));
  }, [id]);

  if (contract === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (contract === null) return <div data-testid="detail-not-found">Contract not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{contract.title}</h2>
      <div data-testid="detail-party">{contract.party}</div>
      <div data-testid="detail-value">{contract.value}</div>
      <div data-testid="detail-status">{contract.status}</div>
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
