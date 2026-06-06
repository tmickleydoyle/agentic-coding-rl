import React, { useState } from "react";

type TrialStatus = "active" | "expired" | "converted";

interface Trial {
  id: number;
  service: string;
  startDate: string;
  endDate: string;
  notes: string;
  status: TrialStatus;
}

const SEED_DATA: Trial[] = [
  { id: 1, service: "Datadog", startDate: "2024-01-01", endDate: "2024-01-14", notes: "Monitoring evaluation", status: "expired" },
  { id: 2, service: "Postman", startDate: "2024-01-10", endDate: "2024-02-10", notes: "API testing team trial", status: "active" },
  { id: 3, service: "Sentry", startDate: "2024-01-15", endDate: "2024-02-15", notes: "Error tracking", status: "active" },
  { id: 4, service: "PlanetScale", startDate: "2023-12-01", endDate: "2023-12-15", notes: "DB scaling test", status: "expired" },
  { id: 5, service: "Retool", startDate: "2024-01-20", endDate: "2024-02-20", notes: "Internal tools", status: "active" },
];

export default function App() {
  const [trials, setTrials] = useState<Trial[]>(SEED_DATA);
  const [filter, setFilter] = useState<"all" | TrialStatus>("all");
  const [nextId, setNextId] = useState(6);

  const [inputService, setInputService] = useState("");
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [inputNotes, setInputNotes] = useState("");
  const [inputStatus, setInputStatus] = useState<TrialStatus>("active");

  const activeCount = trials.filter((t) => t.status === "active").length;
  const expiredCount = trials.filter((t) => t.status === "expired").length;
  const convertedCount = trials.filter((t) => t.status === "converted").length;

  const displayed = filter === "all" ? trials : trials.filter((t) => t.status === filter);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!inputService.trim()) return;
    const newTrial: Trial = {
      id: nextId,
      service: inputService.trim(),
      startDate: inputStartDate,
      endDate: inputEndDate,
      notes: inputNotes.trim(),
      status: inputStatus,
    };
    setTrials((prev) => [...prev, newTrial]);
    setNextId((n) => n + 1);
    setInputService("");
    setInputStartDate("");
    setInputEndDate("");
    setInputNotes("");
    setInputStatus("active");
  }

  function handleDelete(id: number) {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  }

  function handleConvert(id: number) {
    setTrials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "converted" } : t))
    );
  }

  return (
    <div>
      <h1>Trial Tracker</h1>

      <div>
        <span data-testid="active-trials-count">{activeCount}</span>
        <span data-testid="expired-trials-count">{expiredCount}</span>
        <span data-testid="converted-trials-count">{convertedCount}</span>
      </div>

      <div>
        {(["all", "active", "expired", "converted"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {displayed.length === 0 ? (
          <div data-testid="empty-message">No trials found.</div>
        ) : (
          displayed.map((t) => (
            <div key={t.id} data-testid="trial-item">
              <span>{t.service}</span>
              <span>{t.startDate}</span>
              <span>{t.endDate}</span>
              <span>{t.notes}</span>
              <span data-testid="trial-status-badge">{t.status}</span>
              <button data-testid="delete-trial-btn" onClick={() => handleDelete(t.id)}>
                Delete
              </button>
              <button data-testid="convert-btn" onClick={() => handleConvert(t.id)}>
                Mark Converted
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd}>
        <label>
          Service
          <input
            data-testid="input-service"
            value={inputService}
            onChange={(e) => setInputService(e.target.value)}
          />
        </label>
        <label>
          Start Date
          <input
            type="date"
            data-testid="input-start-date"
            value={inputStartDate}
            onChange={(e) => setInputStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            data-testid="input-end-date"
            value={inputEndDate}
            onChange={(e) => setInputEndDate(e.target.value)}
          />
        </label>
        <label>
          Notes
          <textarea
            data-testid="input-notes"
            value={inputNotes}
            onChange={(e) => setInputNotes(e.target.value)}
          />
        </label>
        <label>
          Status
          <select
            data-testid="input-status"
            value={inputStatus}
            onChange={(e) => setInputStatus(e.target.value as TrialStatus)}
          >
            <option value="active">active</option>
            <option value="expired">expired</option>
            <option value="converted">converted</option>
          </select>
        </label>
        <button type="submit">Add Trial</button>
      </form>
    </div>
  );
}
