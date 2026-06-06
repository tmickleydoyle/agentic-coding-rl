import React, { useState } from "react";
import { getExams, getCertifications, addExam } from "../../lib/store";

type FilterType = "all" | "passed" | "failed";

export function ExamsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [certId, setCertId] = useState("");
  const [date, setDate] = useState("");
  const [score, setScore] = useState("75");
  const [notes, setNotes] = useState("");
  const [, forceUpdate] = useState(0);

  const certs = getCertifications();
  const exams = getExams();
  const filtered = exams.filter((e) => {
    if (filter === "passed") return e.passed;
    if (filter === "failed") return !e.passed;
    return true;
  });
  const certMap = new Map<string, string>();
  certs.forEach((c) => certMap.set(c.id, c.name));

  const handleAdd = () => {
    if (!certId || !date) return;
    addExam({ certId, date, score: parseInt(score), notes: notes.trim() });
    setDate(""); setNotes("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="exams-page">
      <h2>Exam History</h2>
      <div>
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        <button data-testid="filter-passed" onClick={() => setFilter("passed")}>Passed</button>
        <button data-testid="filter-failed" onClick={() => setFilter("failed")}>Failed</button>
      </div>
      {filtered.map((e) => (
        <div key={e.id} data-testid="exam-item">
          <span data-testid="exam-date">{e.date}</span>
          <span data-testid="exam-score">{e.score}</span>
          <span data-testid="exam-cert">{certMap.get(e.certId) ?? ""}</span>
          {e.passed ? <span data-testid="pass-badge">Passed</span> : <span data-testid="fail-badge">Failed</span>}
        </div>
      ))}
      <div data-testid="add-exam-form">
        <select data-testid="exam-cert-select" value={certId} onChange={(e) => setCertId(e.target.value)}>
          <option value="">Select cert</option>
          {certs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input data-testid="exam-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="exam-score-input" type="number" value={score} onChange={(e) => setScore(e.target.value)} />
        <input data-testid="exam-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="add-exam-btn" onClick={handleAdd}>Log Attempt</button>
      </div>
    </div>
  );
}
