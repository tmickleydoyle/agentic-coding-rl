import React, { useState } from "react";

type Severity = "P1" | "P2" | "P3";
type IncidentStatus = "investigating" | "monitoring" | "resolved";

interface TimelineNote {
  id: number;
  timestamp: string;
  text: string;
}

interface Incident {
  id: number;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  startedAt: string;
  resolvedAt: string;
  description: string;
  notes: TimelineNote[];
}

const SEED_INCIDENTS: Incident[] = [
  {
    id: 5,
    title: "Notification email delays",
    service: "notifications",
    severity: "P3",
    status: "resolved",
    startedAt: "2024-03-09 16:00",
    resolvedAt: "2024-03-09 17:20",
    description: "Email queue backed up due to SMTP rate limiting.",
    notes: [],
  },
  {
    id: 4,
    title: "Auth token expiry bug",
    service: "auth",
    severity: "P2",
    status: "monitoring",
    startedAt: "2024-03-08 08:30",
    resolvedAt: "",
    description: "Tokens expiring 1 hour early due to timezone handling bug.",
    notes: [],
  },
  {
    id: 3,
    title: "Payment service latency spike",
    service: "payments",
    severity: "P1",
    status: "investigating",
    startedAt: "2024-03-07 11:00",
    resolvedAt: "",
    description: "p99 latency jumped from 200ms to 4s. Root cause unknown.",
    notes: [
      {
        id: 3,
        timestamp: "2024-03-07 11:30",
        text: "Rolled back last deployment — no improvement.",
      },
    ],
  },
  {
    id: 2,
    title: "CDN cache purge loop",
    service: "cdn",
    severity: "P2",
    status: "resolved",
    startedAt: "2024-03-03 14:15",
    resolvedAt: "2024-03-03 15:30",
    description:
      "Misconfigured purge rule causing cache to evict on every request.",
    notes: [],
  },
  {
    id: 1,
    title: "Database connection pool exhausted",
    service: "database",
    severity: "P1",
    status: "resolved",
    startedAt: "2024-03-01 09:00",
    resolvedAt: "2024-03-01 10:45",
    description: "All DB connections used; new queries queuing.",
    notes: [
      {
        id: 1,
        timestamp: "2024-03-01 09:15",
        text: "Identified pool size misconfiguration.",
      },
      {
        id: 2,
        timestamp: "2024-03-01 10:00",
        text: "Increased pool size; connections stabilizing.",
      },
    ],
  },
];

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>(SEED_INCIDENTS);
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [status, setStatus] = useState<IncidentStatus | "">("");
  const [startedAt, setStartedAt] = useState("");
  const [resolvedAt, setResolvedAt] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | IncidentStatus>("all");
  const [filterSeverity, setFilterSeverity] = useState<"All" | Severity>("All");
  const [nextId, setNextId] = useState(6);
  const [nextNoteId, setNextNoteId] = useState(4);

  const [noteTimestamps, setNoteTimestamps] = useState<Record<number, string>>({});
  const [noteTexts, setNoteTexts] = useState<Record<number, string>>({});
  const [noteErrors, setNoteErrors] = useState<Record<number, string>>({});

  function handleAddIncident() {
    if (
      !title.trim() ||
      !service.trim() ||
      !severity ||
      !status ||
      !startedAt.trim() ||
      !description.trim()
    ) {
      setFormError("All required fields must be filled.");
      return;
    }
    const newIncident: Incident = {
      id: nextId,
      title: title.trim(),
      service: service.trim(),
      severity: severity as Severity,
      status: status as IncidentStatus,
      startedAt: startedAt.trim(),
      resolvedAt: resolvedAt.trim(),
      description: description.trim(),
      notes: [],
    };
    setIncidents([newIncident, ...incidents]);
    setNextId(nextId + 1);
    setTitle("");
    setService("");
    setSeverity("");
    setStatus("");
    setStartedAt("");
    setResolvedAt("");
    setDescription("");
    setFormError("");
  }

  function handleChangeStatus(id: number, newStatus: IncidentStatus) {
    setIncidents(
      incidents.map((inc) =>
        inc.id === id ? { ...inc, status: newStatus } : inc
      )
    );
  }

  function handleAddNote(incidentId: number) {
    const ts = (noteTimestamps[incidentId] || "").trim();
    const txt = (noteTexts[incidentId] || "").trim();
    if (!ts || !txt) {
      setNoteErrors({ ...noteErrors, [incidentId]: "Note fields required." });
      return;
    }
    setIncidents(
      incidents.map((inc) => {
        if (inc.id !== incidentId) return inc;
        return {
          ...inc,
          notes: [
            ...inc.notes,
            { id: nextNoteId, timestamp: ts, text: txt },
          ],
        };
      })
    );
    setNextNoteId(nextNoteId + 1);
    setNoteTimestamps({ ...noteTimestamps, [incidentId]: "" });
    setNoteTexts({ ...noteTexts, [incidentId]: "" });
    setNoteErrors({ ...noteErrors, [incidentId]: "" });
  }

  const filtered = incidents.filter((inc) => {
    const matchStatus =
      filterStatus === "all" || inc.status === filterStatus;
    const matchSev =
      filterSeverity === "All" || inc.severity === filterSeverity;
    return matchStatus && matchSev;
  });

  return (
    <main>
      <h1>Incident Log</h1>

      <section aria-label="Add incident form">
        <div>
          <label htmlFor="input-title">Title</label>
          <input
            id="input-title"
            data-testid="input-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-service">Service</label>
          <input
            id="input-service"
            data-testid="input-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
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
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </div>
        <div>
          <label htmlFor="input-status">Status</label>
          <select
            id="input-status"
            data-testid="input-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as IncidentStatus | "")}
          >
            <option value="">-- select --</option>
            <option value="investigating">investigating</option>
            <option value="monitoring">monitoring</option>
            <option value="resolved">resolved</option>
          </select>
        </div>
        <div>
          <label htmlFor="input-started-at">Started At</label>
          <input
            id="input-started-at"
            data-testid="input-started-at"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-resolved-at">Resolved At (optional)</label>
          <input
            id="input-resolved-at"
            data-testid="input-resolved-at"
            value={resolvedAt}
            onChange={(e) => setResolvedAt(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-description">Description</label>
          <textarea
            id="input-description"
            data-testid="input-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {formError && <p data-testid="form-error">{formError}</p>}
        <button data-testid="btn-add-incident" onClick={handleAddIncident}>
          Add Incident
        </button>
      </section>

      <section aria-label="Incident filters">
        <div>
          <button
            data-testid="filter-status-all"
            aria-pressed={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          {(["investigating", "monitoring", "resolved"] as IncidentStatus[]).map(
            (s) => (
              <button
                key={s}
                data-testid={`filter-status-${s}`}
                aria-pressed={filterStatus === s}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            )
          )}
        </div>
        <div>
          <label htmlFor="filter-severity-select">Severity</label>
          <select
            id="filter-severity-select"
            data-testid="filter-severity-select"
            value={filterSeverity}
            onChange={(e) =>
              setFilterSeverity(e.target.value as "All" | Severity)
            }
          >
            <option value="All">All</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </div>
      </section>

      <section aria-label="Incident list">
        {filtered.length === 0 ? (
          <p data-testid="empty-message">No incidents found.</p>
        ) : (
          filtered.map((inc) => (
            <div key={inc.id} data-testid={`incident-card-${inc.id}`}>
              <h2 data-testid={`incident-title-${inc.id}`}>{inc.title}</h2>
              <span data-testid={`incident-service-${inc.id}`}>
                {inc.service}
              </span>
              <span data-testid={`incident-severity-${inc.id}`}>
                {inc.severity}
              </span>
              <span data-testid={`incident-started-${inc.id}`}>
                {inc.startedAt}
              </span>
              <span data-testid={`incident-resolved-at-${inc.id}`}>
                {inc.resolvedAt || "—"}
              </span>
              <p data-testid={`incident-description-${inc.id}`}>
                {inc.description}
              </p>

              <select
                data-testid={`status-select-${inc.id}`}
                value={inc.status}
                onChange={(e) =>
                  handleChangeStatus(inc.id, e.target.value as IncidentStatus)
                }
              >
                <option value="investigating">investigating</option>
                <option value="monitoring">monitoring</option>
                <option value="resolved">resolved</option>
              </select>

              <div data-testid={`notes-list-${inc.id}`}>
                {inc.notes.map((note) => (
                  <div key={note.id} data-testid={`note-${inc.id}-${note.id}`}>
                    <span data-testid={`note-ts-${inc.id}-${note.id}`}>
                      {note.timestamp}
                    </span>
                    <span data-testid={`note-text-${inc.id}-${note.id}`}>
                      {note.text}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <input
                  data-testid={`note-input-ts-${inc.id}`}
                  value={noteTimestamps[inc.id] || ""}
                  onChange={(e) =>
                    setNoteTimestamps({
                      ...noteTimestamps,
                      [inc.id]: e.target.value,
                    })
                  }
                  placeholder="timestamp"
                />
                <input
                  data-testid={`note-input-text-${inc.id}`}
                  value={noteTexts[inc.id] || ""}
                  onChange={(e) =>
                    setNoteTexts({ ...noteTexts, [inc.id]: e.target.value })
                  }
                  placeholder="note text"
                />
                {noteErrors[inc.id] && (
                  <span data-testid={`note-error-${inc.id}`}>
                    {noteErrors[inc.id]}
                  </span>
                )}
                <button
                  data-testid={`btn-add-note-${inc.id}`}
                  onClick={() => handleAddNote(inc.id)}
                >
                  Add Note
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
