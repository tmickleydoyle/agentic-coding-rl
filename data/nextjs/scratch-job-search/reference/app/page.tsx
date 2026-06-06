"use client";
import React, { useState } from "react";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

interface Job {
  id: number;
  company: string;
  role: string;
  location: string;
  status: Status;
  appliedDate: string;
  notes: string;
}

const SEED_JOBS: Job[] = [
  { id: 1, company: "Acme Corp", role: "Frontend Engineer", location: "New York, NY", status: "Applied", appliedDate: "2024-01-10", notes: "Referral from Sarah" },
  { id: 2, company: "Beta Inc", role: "Full Stack Developer", location: "Remote", status: "Interview", appliedDate: "2024-01-08", notes: "Phone screen done" },
  { id: 3, company: "Gamma LLC", role: "React Developer", location: "San Francisco, CA", status: "Offer", appliedDate: "2024-01-05", notes: "Offer: $140k" },
  { id: 4, company: "Delta Co", role: "Software Engineer", location: "Austin, TX", status: "Rejected", appliedDate: "2024-01-03", notes: "No feedback given" },
  { id: 5, company: "Epsilon Ltd", role: "UI Engineer", location: "Remote", status: "Applied", appliedDate: "2024-01-12", notes: "Applied via LinkedIn" },
];

const STATUS_OPTIONS: Status[] = ["Applied", "Interview", "Offer", "Rejected"];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [nextId, setNextId] = useState(6);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Job>>({});

  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<Status>("Applied");

  const filtered = jobs.filter((j) => {
    const matchStatus = statusFilter === "All" || j.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = q === "" || j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  function handleAdd() {
    if (!formCompany.trim() || !formRole.trim()) return;
    const newJob: Job = {
      id: nextId,
      company: formCompany.trim(),
      role: formRole.trim(),
      location: formLocation.trim(),
      status: formStatus,
      appliedDate: formDate,
      notes: formNotes.trim(),
    };
    setJobs([...jobs, newJob]);
    setNextId(nextId + 1);
    setFormCompany("");
    setFormRole("");
    setFormLocation("");
    setFormDate("");
    setFormNotes("");
    setFormStatus("Applied");
  }

  function handleDelete(id: number) {
    setJobs(jobs.filter((j) => j.id !== id));
  }

  function handleEdit(job: Job) {
    setEditingId(job.id);
    setEditDraft({ ...job });
  }

  function handleSave(id: number) {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, ...editDraft } as Job : j)));
    setEditingId(null);
    setEditDraft({});
  }

  function handleCancel() {
    setEditingId(null);
    setEditDraft({});
  }

  return (
    <div>
      <h1>Job Search Tracker</h1>
      <p data-testid="app-count">{filtered.length} Applications</p>

      <div>
        <select
          data-testid="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search by company or role"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <input data-testid="input-company" type="text" placeholder="Company" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
        <input data-testid="input-role" type="text" placeholder="Role" value={formRole} onChange={(e) => setFormRole(e.target.value)} />
        <input data-testid="input-location" type="text" placeholder="Location" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
        <input data-testid="input-date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
        <input data-testid="input-notes" type="text" placeholder="Notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
        <select data-testid="input-status" value={formStatus} onChange={(e) => setFormStatus(e.target.value as Status)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button data-testid="add-btn" onClick={handleAdd}>Add Application</button>
      </div>

      {filtered.length === 0 && (
        <p data-testid="empty-state">No applications found</p>
      )}

      {filtered.map((job) => (
        <div key={job.id} data-testid={`job-card-${job.id}`}>
          {editingId === job.id ? (
            <div>
              <input
                data-testid={`edit-company-${job.id}`}
                type="text"
                value={editDraft.company ?? ""}
                onChange={(e) => setEditDraft({ ...editDraft, company: e.target.value })}
              />
              <input
                data-testid={`edit-role-${job.id}`}
                type="text"
                value={editDraft.role ?? ""}
                onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value })}
              />
              <input
                data-testid={`edit-location-${job.id}`}
                type="text"
                value={editDraft.location ?? ""}
                onChange={(e) => setEditDraft({ ...editDraft, location: e.target.value })}
              />
              <select
                data-testid={`edit-status-${job.id}`}
                value={editDraft.status ?? "Applied"}
                onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as Status })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                data-testid={`edit-notes-${job.id}`}
                type="text"
                value={editDraft.notes ?? ""}
                onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })}
              />
              <button data-testid={`save-${job.id}`} onClick={() => handleSave(job.id)}>Save</button>
              <button data-testid={`cancel-${job.id}`} onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{job.company}</p>
              <p>{job.role}</p>
              <p>{job.location}</p>
              <p>{job.appliedDate}</p>
              <p>{job.notes}</p>
              <span data-testid={`status-${job.id}`}>{job.status}</span>
              <button data-testid={`edit-${job.id}`} onClick={() => handleEdit(job)}>Edit</button>
              <button data-testid={`delete-${job.id}`} onClick={() => handleDelete(job.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
