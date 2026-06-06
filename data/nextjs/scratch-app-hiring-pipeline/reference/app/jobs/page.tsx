import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Job, Department, JobStatus } from "../../lib/types";

const DEPARTMENTS: Department[] = ["Engineering", "Design", "Marketing", "Sales", "Operations"];

export default function JobsPage() {
  const { jobs, setJobs } = useApp();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<Department>("Engineering");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!title.trim()) { setError("Title required"); return; }
    setError("");
    const job: Job = { id: String(Date.now()), title: title.trim(), department, status: "Open" };
    setJobs([...jobs, job]);
    setTitle("");
  }

  function handleToggle(id: string) {
    setJobs(jobs.map((j) => j.id === id ? { ...j, status: (j.status === "Open" ? "Closed" : "Open") as JobStatus } : j));
  }

  return (
    <div data-testid="jobs-page">
      <h1>Job Openings</h1>
      {error && <div data-testid="job-error">{error}</div>}
      <div data-testid="add-job-form">
        <input data-testid="job-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title" />
        <select data-testid="job-dept-select" value={department} onChange={(e) => setDepartment(e.target.value as Department)}>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button data-testid="add-job-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="job-list">
        {jobs.map((j) => (
          <li key={j.id} data-testid={`job-item-${j.id}`}>
            <span data-testid={`job-title-${j.id}`}>{j.title}</span>
            <span data-testid={`job-dept-${j.id}`}>{j.department}</span>
            <span data-testid={`job-status-${j.id}`}>{j.status}</span>
            <button data-testid={`toggle-job-${j.id}`} onClick={() => handleToggle(j.id)}>
              {j.status === "Open" ? "Close" : "Reopen"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
