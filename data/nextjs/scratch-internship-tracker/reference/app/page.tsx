import React, { useState } from "react";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

interface Application {
  id: number;
  company: string;
  role: string;
  status: Status;
  deadline: string;
  notes: string;
}

const SEED: Application[] = [
  { id: 1, company: "Google", role: "Software Engineer Intern", status: "Applied", deadline: "2024-01-15", notes: "Submitted via LinkedIn" },
  { id: 2, company: "Meta", role: "Product Intern", status: "Interview", deadline: "2024-01-20", notes: "Phone screen scheduled" },
  { id: 3, company: "Amazon", role: "SDE Intern", status: "Rejected", deadline: "2024-01-10", notes: "No feedback provided" },
  { id: 4, company: "Stripe", role: "Engineering Intern", status: "Offer", deadline: "2024-02-01", notes: "Great team, $8500/mo" },
];

const STATUSES: Status[] = ["Applied", "Interview", "Offer", "Rejected"];

export default function App() {
  const [applications, setApplications] = useState<Application[]>(SEED);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("Applied");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Status | "All">("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setError("");
    setApplications((prev) => [
      ...prev,
      { id: nextId, company: company.trim(), role: role.trim(), status, deadline, notes },
    ]);
    setNextId((n) => n + 1);
    setCompany("");
    setRole("");
    setStatus("Applied");
    setDeadline("");
    setNotes("");
  };

  const handleDelete = (id: number) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const visible = filter === "All" ? applications : applications.filter((a) => a.status === filter);

  const countTotal = applications.length;
  const countInterviews = applications.filter((a) => a.status === "Interview").length;
  const countOffers = applications.filter((a) => a.status === "Offer").length;

  return (
    <div>
      <h1>Internship Tracker</h1>

      <div>
        <span data-testid="count-total">Total: {countTotal}</span>
        {" | "}
        <span data-testid="count-interviews">Interviews: {countInterviews}</span>
        {" | "}
        <span data-testid="count-offers">Offers: {countOffers}</span>
      </div>

      <div>
        <label>
          Company
          <input
            data-testid="input-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label>
          Role
          <input
            data-testid="input-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </label>
        <label>
          Status
          <select
            data-testid="select-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Deadline
          <input
            type="date"
            data-testid="input-deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>
        <label>
          Notes
          <textarea
            data-testid="input-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button data-testid="btn-add" onClick={handleAdd}>Add Application</button>
        {error && <div data-testid="error-message">{error}</div>}
      </div>

      <div>
        <button
          data-testid="filter-all"
          aria-pressed={filter === "All"}
          onClick={() => setFilter("All")}
        >All</button>
        {STATUSES.map((s) => (
          <button
            key={s}
            data-testid={`filter-${s}`}
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
          >{s}</button>
        ))}
      </div>

      <div>
        {visible.map((app) => (
          <div key={app.id} data-testid="application-item">
            <span data-testid="app-company">{app.company}</span>
            <span data-testid="app-role">{app.role}</span>
            <span data-testid="app-status">{app.status}</span>
            <span data-testid="app-deadline">{app.deadline}</span>
            <span data-testid="app-notes">{app.notes}</span>
            <button data-testid="btn-delete" onClick={() => handleDelete(app.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
