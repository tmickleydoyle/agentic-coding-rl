import React, { useState } from "react";

type Severity = "P1" | "P2" | "P3";

interface ActionItem {
  id: number;
  text: string;
  done: boolean;
}

interface Postmortem {
  id: number;
  title: string;
  incidentDate: string;
  author: string;
  severity: Severity;
  summary: string;
  contributing: string[];
  actionItems: ActionItem[];
}

const SEED_POSTMORTEMS: Postmortem[] = [
  {
    id: 3,
    title: "CDN Cache Purge Loop — Mar 3",
    incidentDate: "2024-03-03",
    author: "carol",
    severity: "P2",
    summary:
      "CDN served stale content for 75 min due to a misconfigured purge rule that evicted cache on every request.",
    contributing: [
      "Config change not reviewed by second engineer",
      "No staging CDN environment",
    ],
    actionItems: [
      { id: 6, text: "Add CDN config peer review requirement", done: false },
      { id: 7, text: "Create staging CDN environment", done: false },
      { id: 8, text: "Add cache-hit-rate alert", done: true },
    ],
  },
  {
    id: 2,
    title: "Auth Token Expiry Bug — Mar 8",
    incidentDate: "2024-03-08",
    author: "bob",
    severity: "P2",
    summary:
      "Users logged out unexpectedly 1 hour early due to a timezone bug in token expiry calculation.",
    contributing: [
      "Timezone offset not applied in JWT generation",
      "No automated test for token expiry edge cases",
    ],
    actionItems: [
      {
        id: 4,
        text: "Add timezone-aware token expiry tests",
        done: false,
      },
      { id: 5, text: "Deploy hotfix to staging first", done: true },
    ],
  },
  {
    id: 1,
    title: "DB Connection Pool Exhaustion — Mar 1",
    incidentDate: "2024-03-01",
    author: "alice",
    severity: "P1",
    summary:
      "Payment service went down for 105 min due to DB pool exhaustion caused by a connection leak introduced in v3.2.1.",
    contributing: [
      "Connection leak in new ORM version",
      "No alerting on pool utilization",
      "Pool size not scaled with traffic growth",
    ],
    actionItems: [
      { id: 1, text: "Add pool utilization alert at 70%", done: true },
      { id: 2, text: "Audit ORM upgrade for connection handling", done: false },
      { id: 3, text: "Document pool sizing runbook", done: false },
    ],
  },
];

export default function App() {
  const [postmortems, setPostmortems] = useState<Postmortem[]>(SEED_POSTMORTEMS);
  const [title, setTitle] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [author, setAuthor] = useState("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [summary, setSummary] = useState("");
  const [formError, setFormError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"all" | Severity>("all");
  const [search, setSearch] = useState("");
  const [nextId, setNextId] = useState(4);
  const [nextActionId, setNextActionId] = useState(9);

  const [factorInputs, setFactorInputs] = useState<Record<number, string>>({});
  const [actionInputs, setActionInputs] = useState<Record<number, string>>({});

  function handleCreate() {
    if (
      !title.trim() ||
      !incidentDate.trim() ||
      !author.trim() ||
      !severity ||
      !summary.trim()
    ) {
      setFormError("All fields are required.");
      return;
    }
    const newPM: Postmortem = {
      id: nextId,
      title: title.trim(),
      incidentDate: incidentDate.trim(),
      author: author.trim(),
      severity: severity as Severity,
      summary: summary.trim(),
      contributing: [],
      actionItems: [],
    };
    setPostmortems([newPM, ...postmortems]);
    setNextId(nextId + 1);
    setTitle("");
    setIncidentDate("");
    setAuthor("");
    setSeverity("");
    setSummary("");
    setFormError("");
  }

  function handleToggleAction(pmId: number, actionId: number) {
    setPostmortems(
      postmortems.map((pm) => {
        if (pm.id !== pmId) return pm;
        return {
          ...pm,
          actionItems: pm.actionItems.map((a) =>
            a.id === actionId ? { ...a, done: !a.done } : a
          ),
        };
      })
    );
  }

  function handleAddFactor(pmId: number) {
    const text = (factorInputs[pmId] || "").trim();
    if (!text) return;
    setPostmortems(
      postmortems.map((pm) => {
        if (pm.id !== pmId) return pm;
        return { ...pm, contributing: [...pm.contributing, text] };
      })
    );
    setFactorInputs({ ...factorInputs, [pmId]: "" });
  }

  function handleAddAction(pmId: number) {
    const text = (actionInputs[pmId] || "").trim();
    if (!text) return;
    setPostmortems(
      postmortems.map((pm) => {
        if (pm.id !== pmId) return pm;
        return {
          ...pm,
          actionItems: [
            ...pm.actionItems,
            { id: nextActionId, text, done: false },
          ],
        };
      })
    );
    setNextActionId(nextActionId + 1);
    setActionInputs({ ...actionInputs, [pmId]: "" });
  }

  const filtered = postmortems.filter((pm) => {
    const matchSev =
      filterSeverity === "all" || pm.severity === filterSeverity;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      pm.title.toLowerCase().includes(q) ||
      pm.summary.toLowerCase().includes(q);
    return matchSev && matchSearch;
  });

  function doneText(pm: Postmortem) {
    const done = pm.actionItems.filter((a) => a.done).length;
    return `${done}/${pm.actionItems.length} done`;
  }

  return (
    <main>
      <h1>Postmortem Tracker</h1>

      <section aria-label="Create postmortem form">
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
          <label htmlFor="input-incident-date">Incident Date</label>
          <input
            id="input-incident-date"
            data-testid="input-incident-date"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-author">Author</label>
          <input
            id="input-author"
            data-testid="input-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
          <label htmlFor="input-summary">Summary</label>
          <textarea
            id="input-summary"
            data-testid="input-summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        {formError && <p data-testid="form-error">{formError}</p>}
        <button data-testid="btn-create" onClick={handleCreate}>
          Create Postmortem
        </button>
      </section>

      <section aria-label="Postmortem filters">
        <div>
          <button
            data-testid="filter-all"
            aria-pressed={filterSeverity === "all"}
            onClick={() => setFilterSeverity("all")}
          >
            All
          </button>
          {(["P1", "P2", "P3"] as Severity[]).map((s) => (
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
          <label htmlFor="input-search">Search postmortems</label>
          <input
            id="input-search"
            data-testid="input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section aria-label="Postmortem list">
        {filtered.length === 0 ? (
          <p data-testid="empty-message">No postmortems found.</p>
        ) : (
          filtered.map((pm) => (
            <div key={pm.id} data-testid={`pm-card-${pm.id}`}>
              <h2 data-testid={`pm-title-${pm.id}`}>{pm.title}</h2>
              <span data-testid={`pm-date-${pm.id}`}>{pm.incidentDate}</span>
              <span data-testid={`pm-author-${pm.id}`}>{pm.author}</span>
              <span data-testid={`pm-severity-${pm.id}`}>{pm.severity}</span>
              <p data-testid={`pm-summary-${pm.id}`}>{pm.summary}</p>
              <span data-testid={`pm-done-${pm.id}`}>{doneText(pm)}</span>

              <ul data-testid={`pm-factors-${pm.id}`}>
                {pm.contributing.map((factor, idx) => (
                  <li key={idx} data-testid={`factor-${pm.id}-${idx}`}>
                    {factor}
                  </li>
                ))}
              </ul>

              <div>
                <input
                  data-testid={`factor-input-${pm.id}`}
                  value={factorInputs[pm.id] || ""}
                  onChange={(e) =>
                    setFactorInputs({ ...factorInputs, [pm.id]: e.target.value })
                  }
                  placeholder="Contributing factor"
                />
                <button
                  data-testid={`btn-add-factor-${pm.id}`}
                  onClick={() => handleAddFactor(pm.id)}
                >
                  Add Factor
                </button>
              </div>

              <ul data-testid={`pm-actions-${pm.id}`}>
                {pm.actionItems.map((action) => (
                  <li key={action.id} data-testid={`action-${pm.id}-${action.id}`}>
                    <input
                      type="checkbox"
                      data-testid={`action-check-${pm.id}-${action.id}`}
                      checked={action.done}
                      onChange={() => handleToggleAction(pm.id, action.id)}
                    />
                    <span data-testid={`action-text-${pm.id}-${action.id}`}>
                      {action.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div>
                <input
                  data-testid={`action-input-${pm.id}`}
                  value={actionInputs[pm.id] || ""}
                  onChange={(e) =>
                    setActionInputs({ ...actionInputs, [pm.id]: e.target.value })
                  }
                  placeholder="New action item"
                />
                <button
                  data-testid={`btn-add-action-${pm.id}`}
                  onClick={() => handleAddAction(pm.id)}
                >
                  Add Action
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
