import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Candidate, CandidateStage } from "../../lib/types";

const STAGES: CandidateStage[] = ["Applied", "Phone Screen", "Technical", "Onsite", "Offer", "Hired", "Rejected"];

export default function CandidatesPage() {
  const { jobs, candidates, setCandidates } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobId, setJobId] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Name required"); return; }
    if (!email.includes("@")) { setError("Invalid email"); return; }
    if (!jobId) { setError("Select a job"); return; }
    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status === "Closed") { setError("Cannot add candidate to closed job"); return; }
    setError("");
    const c: Candidate = { id: String(Date.now()), name: name.trim(), email, jobId, stage: "Applied" };
    setCandidates([...candidates, c]);
    setName(""); setEmail(""); setJobId("");
  }

  function handleStageChange(id: string, stage: CandidateStage) {
    setCandidates(candidates.map((c) => c.id === id ? { ...c, stage } : c));
  }

  return (
    <div data-testid="candidates-page">
      <h1>Candidates</h1>
      {error && <div data-testid="candidate-error">{error}</div>}
      <div data-testid="add-candidate-form">
        <input data-testid="candidate-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="candidate-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <select data-testid="candidate-job-select" value={jobId} onChange={(e) => setJobId(e.target.value)}>
          <option value="">Select job</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} ({j.status})</option>)}
        </select>
        <button data-testid="add-candidate-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="candidate-list">
        {candidates.map((c) => {
          const job = jobs.find((j) => j.id === c.jobId);
          return (
            <li key={c.id} data-testid={`candidate-item-${c.id}`}>
              <span data-testid={`candidate-name-${c.id}`}>{c.name}</span>
              <span data-testid={`candidate-job-${c.id}`}>{job ? job.title : "Unknown"}</span>
              <select
                data-testid={`candidate-stage-${c.id}`}
                value={c.stage}
                onChange={(e) => handleStageChange(c.id, e.target.value as CandidateStage)}
              >
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
