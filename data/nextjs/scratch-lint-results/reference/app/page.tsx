import React, { useState } from "react";

type Level = "error" | "warning";

interface LintResult {
  id: number;
  file: string;
  rule: string;
  level: Level;
  line: number;
  message: string;
  suppressed: boolean;
}

const SEED: LintResult[] = [
  { id: 1, file: "src/auth/login.ts", rule: "no-unused-vars", level: "warning", line: 14, message: "'token' is defined but never used", suppressed: false },
  { id: 2, file: "src/auth/login.ts", rule: "no-explicit-any", level: "error", line: 22, message: "Unexpected any. Specify a type", suppressed: false },
  { id: 3, file: "src/components/Button.tsx", rule: "react-hooks/exhaustive-deps", level: "warning", line: 8, message: "Missing dependency 'onClick'", suppressed: true },
  { id: 4, file: "src/utils/format.ts", rule: "no-console", level: "warning", line: 31, message: "Unexpected console statement", suppressed: false },
  { id: 5, file: "src/api/client.ts", rule: "no-explicit-any", level: "error", line: 5, message: "Unexpected any. Specify a type", suppressed: false },
  { id: 6, file: "src/api/client.ts", rule: "prefer-const", level: "warning", line: 18, message: "'response' is never reassigned", suppressed: true },
  { id: 7, file: "src/components/Modal.tsx", rule: "no-unused-vars", level: "error", line: 45, message: "'props' is defined but never used", suppressed: false },
];

type LevelFilter = "all" | Level;
type SuppressedFilter = "all" | "active" | "suppressed";

export default function App() {
  const [results, setResults] = useState<LintResult[]>(SEED);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [suppressedFilter, setSuppressedFilter] = useState<SuppressedFilter>("all");
  const [nextId, setNextId] = useState(8);

  const [file, setFile] = useState("");
  const [rule, setRule] = useState("");
  const [level, setLevel] = useState<Level>("warning");
  const [line, setLine] = useState(1);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    if (!file.trim() || !message.trim()) return;
    const newResult: LintResult = {
      id: nextId,
      file: file.trim(),
      rule: rule.trim(),
      level,
      line,
      message: message.trim(),
      suppressed: false,
    };
    setResults((prev) => [...prev, newResult]);
    setNextId((n) => n + 1);
    setFile("");
    setRule("");
    setLevel("warning");
    setLine(1);
    setMessage("");
  };

  const handleToggleSuppress = (id: number) => {
    setResults((prev) => prev.map((r) => r.id === id ? { ...r, suppressed: !r.suppressed } : r));
  };

  const handleDelete = (id: number) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = results.filter((r) => {
    const levelMatch = levelFilter === "all" || r.level === levelFilter;
    const suppMatch =
      suppressedFilter === "all" ||
      (suppressedFilter === "active" && !r.suppressed) ||
      (suppressedFilter === "suppressed" && r.suppressed);
    return levelMatch && suppMatch;
  });

  const total = results.length;
  const errors = results.filter((r) => r.level === "error").length;
  const warnings = results.filter((r) => r.level === "warning").length;
  const suppressed = results.filter((r) => r.suppressed).length;

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Lint Results</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <span data-testid="stat-total">Total: {total}</span>
        <span data-testid="stat-errors">Errors: {errors}</span>
        <span data-testid="stat-warnings">Warnings: {warnings}</span>
        <span data-testid="stat-suppressed">Suppressed: {suppressed}</span>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all" onClick={() => setLevelFilter("all")}>All</button>
        <button data-testid="filter-error" onClick={() => setLevelFilter("error")}>Errors</button>
        <button data-testid="filter-warning" onClick={() => setLevelFilter("warning")}>Warnings</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-show-all" onClick={() => setSuppressedFilter("all")}>Show All</button>
        <button data-testid="filter-active" onClick={() => setSuppressedFilter("active")}>Active Only</button>
        <button data-testid="filter-suppressed" onClick={() => setSuppressedFilter("suppressed")}>Suppressed Only</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          data-testid="input-file"
          placeholder="File"
          value={file}
          onChange={(e) => setFile(e.target.value)}
        />
        <input
          data-testid="input-rule"
          placeholder="Rule"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
        />
        <select
          data-testid="select-level"
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
        >
          <option value="error">error</option>
          <option value="warning">warning</option>
        </select>
        <input
          data-testid="input-line"
          type="number"
          value={line}
          onChange={(e) => setLine(Number(e.target.value))}
        />
        <input
          data-testid="input-message"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button data-testid="btn-add-result" onClick={handleAdd}>Add Result</button>
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>File</th>
            <th>Rule</th>
            <th>Level</th>
            <th>Line</th>
            <th>Message</th>
            <th>Suppressed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} data-testid={`lint-row-${r.id}`}>
              <td>{r.file}</td>
              <td>{r.rule}</td>
              <td data-testid={`level-${r.id}`}>{r.level}</td>
              <td data-testid={`line-${r.id}`}>{r.line}</td>
              <td>{r.message}</td>
              <td>
                {r.suppressed && (
                  <span data-testid={`suppressed-badge-${r.id}`}>Suppressed</span>
                )}
              </td>
              <td>
                <button data-testid={`btn-suppress-${r.id}`} onClick={() => handleToggleSuppress(r.id)}>
                  {r.suppressed ? "Unsuppress" : "Suppress"}
                </button>
                <button data-testid={`btn-delete-${r.id}`} onClick={() => handleDelete(r.id)}>
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
