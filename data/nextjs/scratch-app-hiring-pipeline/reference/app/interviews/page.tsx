import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Interview, InterviewType, InterviewResult } from "../../lib/types";

const TYPES: InterviewType[] = ["Phone", "Technical", "Onsite", "Final"];
const RESULTS: InterviewResult[] = ["Pending", "Pass", "Fail"];

export default function InterviewsPage() {
  const { candidates, interviews, setInterviews } = useApp();
  const [candidateId, setCandidateId] = useState("");
  const [type, setType] = useState<InterviewType>("Phone");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<InterviewResult>("Pending");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!candidateId) { setError("Select candidate"); return; }
    if (!scheduledDate) { setError("Date required"); return; }
    setError("");
    const i: Interview = { id: String(Date.now()), candidateId, type, scheduledDate, notes, result };
    setInterviews([...interviews, i]);
    setNotes(""); setScheduledDate("");
  }

  return (
    <div data-testid="interviews-page">
      <h1>Interviews</h1>
      {error && <div data-testid="interview-error">{error}</div>}
      <div data-testid="add-interview-form">
        <select data-testid="interview-candidate-select" value={candidateId} onChange={(e) => setCandidateId(e.target.value)}>
          <option value="">Select candidate</option>
          {candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select data-testid="interview-type-select" value={type} onChange={(e) => setType(e.target.value as InterviewType)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input data-testid="interview-date-input" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        <input data-testid="interview-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <select data-testid="interview-result-select" value={result} onChange={(e) => setResult(e.target.value as InterviewResult)}>
          {RESULTS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button data-testid="add-interview-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="interview-list">
        {interviews.map((i) => {
          const c = candidates.find((x) => x.id === i.candidateId);
          return (
            <li key={i.id} data-testid={`interview-item-${i.id}`}>
              <span data-testid={`interview-candidate-${i.id}`}>{c ? c.name : "Unknown"}</span>
              <span data-testid={`interview-type-${i.id}`}>{i.type}</span>
              <span data-testid={`interview-date-${i.id}`}>{i.scheduledDate}</span>
              <span data-testid={`interview-result-${i.id}`}>{i.result}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
