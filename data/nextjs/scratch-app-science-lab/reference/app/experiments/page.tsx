import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addExperiment, updateExperimentStatus } from "../../lib/store";
import type { ExperimentStatus } from "../../lib/types";

const STATUSES: ExperimentStatus[] = ["planned", "running", "completed", "failed"];

export default function ExperimentsPage() {
  const { experiments, setExperiments } = useApp();
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!title.trim() || !hypothesis.trim() || !subject.trim() || !startDate) { setError("Title, hypothesis, subject, startDate required"); return; }
    const e = addExperiment({ title: title.trim(), hypothesis: hypothesis.trim(), subject: subject.trim(), status: "planned", startDate, endDate, observations: "", conclusion: "" });
    setExperiments([...experiments, e]);
    setTitle(""); setHypothesis(""); setSubject(""); setStartDate(""); setEndDate(""); setError("");
  }

  function handleStatus(id: string, status: ExperimentStatus) {
    const updated = updateExperimentStatus(id, status);
    if (updated) setExperiments(experiments.map(e => e.id === id ? updated : e));
  }

  return (
    <div data-testid="experiments-page">
      <h2>Experiments</h2>
      {error && <div data-testid="experiment-error">{error}</div>}
      <ul data-testid="experiment-list">
        {experiments.map(e => (
          <li key={e.id} data-testid={`experiment-item-${e.id}`}>
            <span data-testid={`experiment-title-${e.id}`}>{e.title}</span>
            <span data-testid={`experiment-subject-${e.id}`}>{e.subject}</span>
            <span data-testid={`experiment-status-${e.id}`}>{e.status}</span>
            <select data-testid={`select-status-${e.id}`} value={e.status} onChange={ev => handleStatus(e.id, ev.target.value as ExperimentStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </li>
        ))}
      </ul>
      <div data-testid="add-experiment-form">
        <input data-testid="input-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-hypothesis" value={hypothesis} onChange={e => setHypothesis(e.target.value)} placeholder="Hypothesis" />
        <input data-testid="input-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" />
        <input data-testid="input-start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input data-testid="input-end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button data-testid="btn-add-experiment" onClick={handleAdd}>Add Experiment</button>
      </div>
    </div>
  );
}
