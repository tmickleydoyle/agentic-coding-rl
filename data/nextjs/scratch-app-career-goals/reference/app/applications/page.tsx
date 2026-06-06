import React, { useState } from "react";
import { getApplications, addApplication, updateApplicationStatus } from "../../lib/store";
import { Application } from "../../lib/types";

export function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [, forceUpdate] = useState(0);

  const applications = getApplications();
  const filtered = statusFilter === "all" ? applications : applications.filter((a) => a.status === statusFilter);

  const handleAdd = () => {
    if (!company.trim() || !role.trim()) return;
    addApplication({ company: company.trim(), role: role.trim(), notes: notes.trim() });
    setCompany(""); setRole(""); setNotes("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="applications-page">
      <h2>Applications</h2>
      <select data-testid="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
        <option value="withdrawn">Withdrawn</option>
      </select>
      {filtered.map((a) => (
        <div key={a.id} data-testid="application-item">
          <span data-testid="app-company">{a.company}</span>
          <span data-testid="app-role">{a.role}</span>
          <span data-testid="app-status">{a.status}</span>
          <select
            data-testid="status-select"
            value={a.status}
            onChange={(e) => { updateApplicationStatus(a.id, e.target.value as Application["status"]); forceUpdate((n) => n + 1); }}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      ))}
      <div data-testid="add-application-form">
        <input data-testid="app-company-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        <input data-testid="app-role-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input data-testid="app-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="add-application-btn" onClick={handleAdd}>Add Application</button>
      </div>
    </div>
  );
}
