import React, { useState } from "react";

interface Pattern {
  id: number;
  name: string;
  yarn: string;
  needleSize: string;
  rows: number;
  status: "active" | "complete";
}

const SEED: Pattern[] = [
  { id: 1, name: "Cozy Scarf", yarn: "Merino Wool", needleSize: "5mm", rows: 120, status: "active" },
  { id: 2, name: "Baby Blanket", yarn: "Cotton Blend", needleSize: "4mm", rows: 200, status: "active" },
  { id: 3, name: "Winter Hat", yarn: "Alpaca", needleSize: "6mm", rows: 80, status: "complete" },
  { id: 4, name: "Fingerless Gloves", yarn: "Sock Yarn", needleSize: "2.5mm", rows: 60, status: "complete" },
];

export default function App() {
  const [patterns, setPatterns] = useState<Pattern[]>(SEED);
  const [nextId, setNextId] = useState(5);
  const [filter, setFilter] = useState<"all" | "active" | "complete">("all");

  const [inputName, setInputName] = useState("");
  const [inputYarn, setInputYarn] = useState("");
  const [inputNeedle, setInputNeedle] = useState("");
  const [inputRows, setInputRows] = useState("");

  const handleAdd = () => {
    if (!inputName.trim()) return;
    const rows = parseInt(inputRows, 10);
    if (!rows || rows <= 0) return;
    const newPattern: Pattern = {
      id: nextId,
      name: inputName.trim(),
      yarn: inputYarn.trim(),
      needleSize: inputNeedle.trim(),
      rows,
      status: "active",
    };
    setPatterns((prev) => [...prev, newPattern]);
    setNextId((n) => n + 1);
    setInputName("");
    setInputYarn("");
    setInputNeedle("");
    setInputRows("");
  };

  const handleComplete = (id: number) => {
    setPatterns((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "complete" } : p))
    );
  };

  const handleDelete = (id: number) => {
    setPatterns((prev) => prev.filter((p) => p.id !== id));
  };

  const displayed = patterns.filter((p) => {
    if (filter === "active") return p.status === "active";
    if (filter === "complete") return p.status === "complete";
    return true;
  });

  const activeCount = patterns.filter((p) => p.status === "active").length;
  const completeCount = patterns.filter((p) => p.status === "complete").length;

  return (
    <div>
      <h1>Knitting Pattern Manager</h1>

      <div>
        <label htmlFor="input-name">Pattern Name</label>
        <input
          id="input-name"
          data-testid="input-name"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <label htmlFor="input-yarn">Yarn Type</label>
        <input
          id="input-yarn"
          data-testid="input-yarn"
          type="text"
          value={inputYarn}
          onChange={(e) => setInputYarn(e.target.value)}
        />
        <label htmlFor="input-needle">Needle Size</label>
        <input
          id="input-needle"
          data-testid="input-needle"
          type="text"
          value={inputNeedle}
          onChange={(e) => setInputNeedle(e.target.value)}
        />
        <label htmlFor="input-rows">Row Count</label>
        <input
          id="input-rows"
          data-testid="input-rows"
          type="number"
          value={inputRows}
          onChange={(e) => setInputRows(e.target.value)}
        />
        <button data-testid="btn-add" onClick={handleAdd}>
          Add Pattern
        </button>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter("all")}>
          All
        </button>
        <button data-testid="filter-active" onClick={() => setFilter("active")}>
          Active
        </button>
        <button data-testid="filter-complete" onClick={() => setFilter("complete")}>
          Complete
        </button>
      </div>

      <div data-testid="summary">
        {patterns.length} patterns ({activeCount} active, {completeCount} complete)
      </div>

      {displayed.length === 0 ? (
        <div data-testid="empty-msg">No patterns found</div>
      ) : (
        <div>
          {displayed.map((p) => (
            <div key={p.id} data-testid={`pattern-${p.id}`}>
              <span data-testid={`pattern-name-${p.id}`}>{p.name}</span>
              <span data-testid={`pattern-yarn-${p.id}`}>{p.yarn}</span>
              <span data-testid={`pattern-needle-${p.id}`}>{p.needleSize}</span>
              <span data-testid={`pattern-rows-${p.id}`}>{p.rows}</span>
              <span data-testid={`pattern-status-${p.id}`}>{p.status}</span>
              {p.status === "active" && (
                <button
                  data-testid={`btn-complete-${p.id}`}
                  onClick={() => handleComplete(p.id)}
                >
                  Mark Complete
                </button>
              )}
              <button
                data-testid={`btn-delete-${p.id}`}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
