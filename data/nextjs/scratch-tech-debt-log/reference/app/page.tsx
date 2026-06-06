import React, { useState } from "react";

type Area = "frontend" | "backend" | "devops";
type Severity = "low" | "medium" | "high";
type Status = "open" | "resolved";

interface DebtItem {
  id: number;
  title: string;
  area: Area;
  severity: Severity;
  effort: number;
  status: Status;
  created: string;
}

const SEED: DebtItem[] = [
  { id: 1, title: "Replace deprecated lodash methods", area: "frontend", severity: "high", effort: 3, status: "open", created: "2024-02-01" },
  { id: 2, title: "Add database connection pooling", area: "backend", severity: "high", effort: 5, status: "open", created: "2024-02-03" },
  { id: 3, title: "Remove dead code in auth module", area: "backend", severity: "low", effort: 1, status: "resolved", created: "2024-02-05" },
  { id: 4, title: "Upgrade webpack to v5", area: "frontend", severity: "medium", effort: 4, status: "open", created: "2024-02-07" },
  { id: 5, title: "Improve test coverage for API layer", area: "backend", severity: "medium", effort: 3, status: "open", created: "2024-02-09" },
  { id: 6, title: "Fix memory leak in event listeners", area: "frontend", severity: "high", effort: 2, status: "resolved", created: "2024-02-11" },
];

type AreaFilter = "all" | Area;
type StatusFilter = "all" | Status;

export default function App() {
  const [items, setItems] = useState<DebtItem[]>(SEED);
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [nextId, setNextId] = useState(7);

  const [title, setTitle] = useState("");
  const [area, setArea] = useState<Area>("frontend");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [effort, setEffort] = useState(1);
  const [created, setCreated] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    const newItem: DebtItem = {
      id: nextId,
      title: title.trim(),
      area,
      severity,
      effort,
      status: "open",
      created,
    };
    setItems((prev) => [...prev, newItem]);
    setNextId((n) => n + 1);
    setTitle("");
    setArea("frontend");
    setSeverity("medium");
    setEffort(1);
    setCreated("");
  };

  const handleToggle = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "open" ? "resolved" : "open" } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = items.filter((item) => {
    const areaMatch = areaFilter === "all" || item.area === areaFilter;
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    return areaMatch && statusMatch;
  });

  const total = items.length;
  const openCount = items.filter((i) => i.status === "open").length;
  const avgEffort = total === 0 ? "0.0" : (items.reduce((sum, i) => sum + i.effort, 0) / total).toFixed(1);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Tech Debt Log</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <span data-testid="stat-total">Total: {total}</span>
        <span data-testid="stat-open">Open: {openCount}</span>
        <span data-testid="stat-avg-effort">Avg Effort: {avgEffort}</span>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all" onClick={() => setAreaFilter("all")}>All</button>
        <button data-testid="filter-frontend" onClick={() => setAreaFilter("frontend")}>Frontend</button>
        <button data-testid="filter-backend" onClick={() => setAreaFilter("backend")}>Backend</button>
        <button data-testid="filter-devops" onClick={() => setAreaFilter("devops")}>DevOps</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all-status" onClick={() => setStatusFilter("all")}>All Status</button>
        <button data-testid="filter-open" onClick={() => setStatusFilter("open")}>Open</button>
        <button data-testid="filter-resolved-status" onClick={() => setStatusFilter("resolved")}>Resolved</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          data-testid="input-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          data-testid="select-area"
          value={area}
          onChange={(e) => setArea(e.target.value as Area)}
        >
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
          <option value="devops">devops</option>
        </select>
        <select
          data-testid="select-severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity)}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input
          data-testid="input-effort"
          type="number"
          min={1}
          max={5}
          value={effort}
          onChange={(e) => setEffort(Number(e.target.value))}
        />
        <input
          data-testid="input-created"
          type="date"
          value={created}
          onChange={(e) => setCreated(e.target.value)}
        />
        <button data-testid="btn-add-debt" onClick={handleAdd}>Add Debt</button>
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Area</th>
            <th>Severity</th>
            <th>Effort</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} data-testid={`debt-row-${item.id}`}>
              <td>{item.title}</td>
              <td>{item.area}</td>
              <td data-testid={`severity-${item.id}`}>{item.severity}</td>
              <td data-testid={`effort-${item.id}`}>{item.effort}</td>
              <td data-testid={`status-${item.id}`}>{item.status}</td>
              <td>{item.created}</td>
              <td>
                <button data-testid={`btn-toggle-${item.id}`} onClick={() => handleToggle(item.id)}>
                  {item.status === "open" ? "Resolve" : "Reopen"}
                </button>
                <button data-testid={`btn-delete-${item.id}`} onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
