import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { ApprovalRequest, RequestType } from "../lib/types";

function DashboardPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  useEffect(() => {
    fetch("/api/requests").then((r) => r.json()).then(setRequests);
  }, []);

  const pending = requests.filter((r) => r.status === "Pending").length;
  const approved = requests.filter((r) => r.status === "Approved");
  const rejected = requests.filter((r) => r.status === "Rejected").length;
  const approvedTotal = approved.reduce((s, r) => s + r.amount, 0);

  return (
    <div data-testid="dashboard-page">
      <h1>Approval Flow</h1>
      <div data-testid="stat-total">Total: {requests.length}</div>
      <div data-testid="stat-pending">Pending: {pending}</div>
      <div data-testid="stat-approved">Approved: {approved.length}</div>
      <div data-testid="stat-rejected">Rejected: {rejected}</div>
      <div data-testid="stat-approved-amount">Approved Amount: {approvedTotal}</div>
    </div>
  );
}

function ListPage() {
  const { navigate } = useApp();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/requests").then((r) => r.json()).then(setRequests);
  }, []);

  const filtered = requests.filter(
    (r) =>
      (typeFilter === "All" || r.type === typeFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
  );

  return (
    <div data-testid="list-page">
      <h2>Approval Requests</h2>
      <select data-testid="filter-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="All">All Types</option>
        <option value="Budget">Budget</option>
        <option value="Software">Software</option>
        <option value="Travel">Travel</option>
        <option value="Equipment">Equipment</option>
        <option value="Other">Other</option>
      </select>
      <select data-testid="filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button data-testid="add-request-btn" onClick={() => navigate({ name: "add" })}>New Request</button>
      {filtered.length === 0 ? (
        <div data-testid="no-requests">No requests found</div>
      ) : (
        <ul data-testid="request-list">
          {filtered.map((r) => (
            <li key={r.id} data-testid={`request-item-${r.id}`}>
              <button data-testid={`request-link-${r.id}`} onClick={() => navigate({ name: "detail", id: r.id })}>
                {r.title}
              </button>
              <span data-testid={`request-status-${r.id}`}>{r.status}</span>
              <span data-testid={`request-amount-${r.id}`}>{r.amount}</span>
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
  const [submitter, setSubmitter] = useState("");
  const [type, setType] = useState<RequestType>("Budget");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!submitter.trim()) errs.push("Submitter is required");
    if (!amount || Number(amount) <= 0) errs.push("Amount must be greater than 0");
    if (errs.length > 0) { setErrors(errs); return; }
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, submitter, type, amount: Number(amount) }),
    });
    navigate({ name: "list" });
  };

  return (
    <div data-testid="add-page">
      <h2>New Request</h2>
      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="input-submitter" value={submitter} onChange={(e) => setSubmitter(e.target.value)} />
        <select data-testid="input-type" value={type} onChange={(e) => setType(e.target.value as RequestType)}>
          <option value="Budget">Budget</option>
          <option value="Software">Software</option>
          <option value="Travel">Travel</option>
          <option value="Equipment">Equipment</option>
          <option value="Other">Other</option>
        </select>
        <input data-testid="input-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        {errors.length > 0 && (
          <ul data-testid="form-errors">
            {errors.map((err, i) => <li key={i} data-testid={`form-error-${i}`}>{err}</li>)}
          </ul>
        )}
        <button type="submit" data-testid="submit-btn">Submit</button>
        <button type="button" data-testid="cancel-btn" onClick={() => navigate({ name: "list" })}>Cancel</button>
      </form>
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [request, setRequest] = useState<ApprovalRequest | null | undefined>(undefined);
  const [comment, setComment] = useState("");

  const load = () => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data: ApprovalRequest[]) => setRequest(data.find((r) => r.id === id) ?? null));
  };

  useEffect(load, [id]);

  const handleAction = async (status: "Approved" | "Rejected") => {
    await fetch("/api/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, comment }),
    });
    load();
  };

  if (request === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (request === null) return <div data-testid="detail-not-found">Request not found</div>;

  return (
    <div data-testid="detail-page">
      <h2 data-testid="detail-title">{request.title}</h2>
      <div data-testid="detail-submitter">{request.submitter}</div>
      <div data-testid="detail-amount">{request.amount}</div>
      <div data-testid="detail-status">{request.status}</div>
      <div data-testid="detail-comment">{request.comment}</div>
      {request.status === "Pending" && (
        <div data-testid="approval-actions">
          <input data-testid="approval-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" />
          <button data-testid="approve-btn" onClick={() => handleAction("Approved")}>Approve</button>
          <button data-testid="reject-btn" onClick={() => handleAction("Rejected")}>Reject</button>
        </div>
      )}
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
