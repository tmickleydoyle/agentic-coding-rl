import React, { useState } from "react";

type AppType = "Early Action" | "Early Decision" | "Regular Decision";
type EssayStatus = "Not Started" | "In Progress" | "Done";
type Decision = "Pending" | "Accepted" | "Rejected" | "Waitlisted";

interface CollegeApp {
  id: number;
  school: string;
  deadline: string;
  type: AppType;
  essayStatus: EssayStatus;
  decision: Decision;
}

const SEED: CollegeApp[] = [
  { id: 1, school: "MIT", deadline: "2024-01-01", type: "Early Action", essayStatus: "Done", decision: "Pending" },
  { id: 2, school: "Stanford", deadline: "2024-01-05", type: "Regular Decision", essayStatus: "In Progress", decision: "Pending" },
  { id: 3, school: "Harvard", deadline: "2023-11-01", type: "Early Decision", essayStatus: "Done", decision: "Accepted" },
  { id: 4, school: "UCLA", deadline: "2024-11-30", type: "Regular Decision", essayStatus: "Not Started", decision: "Pending" },
];

const TYPES: AppType[] = ["Early Action", "Early Decision", "Regular Decision"];
const ESSAY_STATUSES: EssayStatus[] = ["Not Started", "In Progress", "Done"];
const DECISIONS: Decision[] = ["Pending", "Accepted", "Rejected", "Waitlisted"];

export default function App() {
  const [apps, setApps] = useState<CollegeApp[]>(SEED);
  const [school, setSchool] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState<AppType>("Regular Decision");
  const [essayStatus, setEssayStatus] = useState<EssayStatus>("Not Started");
  const [decision, setDecision] = useState<Decision>("Pending");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Decision | "All">("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!school.trim()) {
      setError("School name is required.");
      return;
    }
    setError("");
    setApps((prev) => [
      ...prev,
      { id: nextId, school: school.trim(), deadline, type, essayStatus, decision },
    ]);
    setNextId((n) => n + 1);
    setSchool("");
    setDeadline("");
    setType("Regular Decision");
    setEssayStatus("Not Started");
    setDecision("Pending");
  };

  const handleDelete = (id: number) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  const visible = filter === "All" ? apps : apps.filter((a) => a.decision === filter);

  const countTotal = apps.length;
  const countAccepted = apps.filter((a) => a.decision === "Accepted").length;
  const countPending = apps.filter((a) => a.decision === "Pending").length;

  return (
    <div>
      <h1>College Application Tracker</h1>

      <div>
        <span data-testid="count-total">Total: {countTotal}</span>
        {" | "}
        <span data-testid="count-accepted">Accepted: {countAccepted}</span>
        {" | "}
        <span data-testid="count-pending">Pending: {countPending}</span>
      </div>

      <div>
        <label>
          School
          <input data-testid="input-school" value={school} onChange={(e) => setSchool(e.target.value)} />
        </label>
        <label>
          Deadline
          <input type="date" data-testid="input-deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <label>
          Type
          <select data-testid="select-type" value={type} onChange={(e) => setType(e.target.value as AppType)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Essay Status
          <select data-testid="select-essay" value={essayStatus} onChange={(e) => setEssayStatus(e.target.value as EssayStatus)}>
            {ESSAY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Decision
          <select data-testid="select-decision" value={decision} onChange={(e) => setDecision(e.target.value as Decision)}>
            {DECISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <button data-testid="btn-add" onClick={handleAdd}>Add Application</button>
        {error && <div data-testid="error-message">{error}</div>}
      </div>

      <div>
        <button data-testid="filter-all" aria-pressed={filter === "All"} onClick={() => setFilter("All")}>All</button>
        {DECISIONS.map((d) => (
          <button key={d} data-testid={`filter-${d}`} aria-pressed={filter === d} onClick={() => setFilter(d)}>{d}</button>
        ))}
      </div>

      <div>
        {visible.map((app) => (
          <div key={app.id} data-testid="app-item">
            <span data-testid="app-school">{app.school}</span>
            <span data-testid="app-deadline">{app.deadline}</span>
            <span data-testid="app-type">{app.type}</span>
            <span data-testid="app-essay">{app.essayStatus}</span>
            <span data-testid="app-decision">{app.decision}</span>
            <button data-testid="btn-delete" onClick={() => handleDelete(app.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
