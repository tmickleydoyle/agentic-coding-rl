import React, { useState } from "react";

type Severity = "info" | "warning" | "critical";

interface LogEntry {
  id: number;
  timestamp: string;
  service: string;
  severity: Severity;
  summary: string;
  action: string;
  resolved: boolean;
}

const SEED_ENTRIES: LogEntry[] = [
  {
    id: 5,
    timestamp: "2024-02-07 03:22",
    service: "storage",
    severity: "warning",
    summary: "Disk usage on storage-01 at 85%",
    action: "Deleted old log archives. Disk at 60%.",
    resolved: true,
  },
  {
    id: 4,
    timestamp: "2024-02-06 19:05",
    service: "notifications",
    severity: "info",
    summary: "Email notification queue depth > 10k",
    action: "Scaled up notification workers x2.",
    resolved: true,
  },
  {
    id: 3,
    timestamp: "2024-02-06 14:30",
    service: "api-gateway",
    severity: "critical",
    summary: "API gateway returning 502 for 15% of requests",
    action: "Rolled back last deployment. Investigating root cause.",
    resolved: false,
  },
  {
    id: 2,
    timestamp: "2024-02-05 08:47",
    service: "auth",
    severity: "warning",
    summary: "Login latency elevated — p99 > 2s",
    action: "Identified slow DB query; added index. Deployed hotfix.",
    resolved: true,
  },
  {
    id: 1,
    timestamp: "2024-02-05 02:14",
    service: "payments",
    severity: "critical",
    summary: "Payment processor timeout — 503 errors spiking",
    action: "Restarted payment worker pods; errors cleared after 3 mins.",
    resolved: true,
  },
];

const SEVERITIES: Severity[] = ["info", "warning", "critical"];

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SEED_ENTRIES);
  const [timestamp, setTimestamp] = useState("");
  const [service, setService] = useState("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [summary, setSummary] = useState("");
  const [action, setAction] = useState("");
  const [resolvedForm, setResolvedForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"all" | Severity>("all");
  const [showUnresolved, setShowUnresolved] = useState(false);
  const [nextId, setNextId] = useState(6);

  function handleAdd() {
    if (
      !timestamp.trim() ||
      !service.trim() ||
      !severity ||
      !summary.trim() ||
      !action.trim()
    ) {
      setFormError("All fields are required.");
      return;
    }
    const newEntry: LogEntry = {
      id: nextId,
      timestamp: timestamp.trim(),
      service: service.trim(),
      severity: severity as Severity,
      summary: summary.trim(),
      action: action.trim(),
      resolved: resolvedForm,
    };
    setEntries([newEntry, ...entries]);
    setNextId(nextId + 1);
    setTimestamp("");
    setService("");
    setSeverity("");
    setSummary("");
    setAction("");
    setResolvedForm(false);
    setFormError("");
  }

  function handleToggleResolved(id: number) {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, resolved: !e.resolved } : e))
    );
  }

  const filtered = entries.filter((e) => {
    const matchSev =
      filterSeverity === "all" || e.severity === filterSeverity;
    const matchUnres = !showUnresolved || !e.resolved;
    return matchSev && matchUnres;
  });

  const unresolvedCount = entries.filter((e) => !e.resolved).length;

  return (
    <main>
      <h1>On-Call Log</h1>

      <section aria-label="Stats">
        <span data-testid="stat-visible">Visible: {filtered.length}</span>
        <span data-testid="stat-unresolved">Unresolved: {unresolvedCount}</span>
      </section>

      <section aria-label="Add entry form">
        <div>
          <label htmlFor="input-timestamp">Timestamp</label>
          <input
            id="input-timestamp"
            data-testid="input-timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="YYYY-MM-DD HH:MM"
          />
        </div>
        <div>
          <label htmlFor="input-service">Service</label>
          <input
            id="input-service"
            data-testid="input-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="service name"
          />
        </div>
        <div>
          <label htmlFor="input-severity">Severity</label>
          <select
            id="input-severity"
            data-testid="input-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity | "")}
          >
            <option value="">-- select --</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="input-summary">Summary</label>
          <input
            id="input-summary"
            data-testid="input-summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-action">Action Taken</label>
          <textarea
            id="input-action"
            data-testid="input-action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              data-testid="input-resolved"
              checked={resolvedForm}
              onChange={(e) => setResolvedForm(e.target.checked)}
            />
            Resolved
          </label>
        </div>
        {formError && <p data-testid="form-error">{formError}</p>}
        <button data-testid="btn-log" onClick={handleAdd}>
          Log Entry
        </button>
      </section>

      <section aria-label="Filters">
        <div>
          <button
            data-testid="filter-all"
            aria-pressed={filterSeverity === "all"}
            onClick={() => setFilterSeverity("all")}
          >
            All
          </button>
          {SEVERITIES.map((s) => (
            <button
              key={s}
              data-testid={`filter-${s}`}
              aria-pressed={filterSeverity === s}
              onClick={() => setFilterSeverity(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              data-testid="filter-unresolved"
              checked={showUnresolved}
              onChange={(e) => setShowUnresolved(e.target.checked)}
            />
            Show only unresolved
          </label>
        </div>
      </section>

      <section aria-label="Log entries">
        {filtered.length === 0 ? (
          <p data-testid="empty-message">No entries found.</p>
        ) : (
          filtered.map((e) => (
            <div key={e.id} data-testid={`entry-card-${e.id}`}>
              <span data-testid={`entry-timestamp-${e.id}`}>{e.timestamp}</span>
              <span data-testid={`entry-service-${e.id}`}>{e.service}</span>
              <span data-testid={`entry-severity-${e.id}`}>{e.severity}</span>
              <p data-testid={`entry-summary-${e.id}`}>{e.summary}</p>
              <p data-testid={`entry-action-${e.id}`}>{e.action}</p>
              <span data-testid={`entry-resolved-${e.id}`}>
                {e.resolved ? "resolved" : "unresolved"}
              </span>
              <button
                data-testid={`btn-toggle-${e.id}`}
                onClick={() => handleToggleResolved(e.id)}
              >
                {e.resolved ? "Mark Unresolved" : "Mark Resolved"}
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
