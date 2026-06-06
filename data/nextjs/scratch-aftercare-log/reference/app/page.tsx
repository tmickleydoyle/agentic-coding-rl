import React, { useState } from "react";

interface LogEntry {
  id: number;
  piece: string;
  step: string;
  dueDate: string;
  completed: boolean;
}

const SEED_ENTRIES: LogEntry[] = [
  { id: 1, piece: "Left arm tattoo", step: "Clean with fragrance-free soap", dueDate: "2024-06-01", completed: true },
  { id: 2, piece: "Left arm tattoo", step: "Apply unscented moisturizer", dueDate: "2024-06-01", completed: false },
  { id: 3, piece: "Nostril piercing", step: "Saline spray twice daily", dueDate: "2024-06-02", completed: false },
  { id: 4, piece: "Navel piercing", step: "Avoid submerging in water", dueDate: "2024-06-03", completed: true },
];

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SEED_ENTRIES);
  const [piece, setPiece] = useState("");
  const [step, setStep] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pieceFilter, setPieceFilter] = useState("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!piece.trim() || !step.trim() || !dueDate.trim()) return;
    const newEntry: LogEntry = {
      id: nextId,
      piece: piece.trim(),
      step: step.trim(),
      dueDate: dueDate.trim(),
      completed: false,
    };
    setEntries([...entries, newEntry]);
    setNextId(nextId + 1);
    setPiece("");
    setStep("");
    setDueDate("");
  };

  const toggleCompleted = (id: number) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)));
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const uniquePieces = Array.from(new Set(entries.map((e) => e.piece)));

  const visible =
    pieceFilter === "All" ? entries : entries.filter((e) => e.piece === pieceFilter);

  const completedCount = visible.filter((e) => e.completed).length;

  return (
    <div>
      <h1>Aftercare Log</h1>

      <div data-testid="add-form">
        <input
          data-testid="piece-input"
          placeholder="Piece name"
          value={piece}
          onChange={(e) => setPiece(e.target.value)}
        />
        <input
          data-testid="step-input"
          placeholder="Care step"
          value={step}
          onChange={(e) => setStep(e.target.value)}
        />
        <input
          data-testid="due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button data-testid="add-button" onClick={handleAdd}>
          Add Step
        </button>
      </div>

      <div data-testid="filter-section">
        <select
          data-testid="piece-filter"
          value={pieceFilter}
          onChange={(e) => setPieceFilter(e.target.value)}
        >
          <option value="All">All</option>
          {uniquePieces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div data-testid="progress-summary">
        {completedCount} / {visible.length} steps completed
      </div>

      <div data-testid="log-list">
        {visible.map((entry) => (
          <div key={entry.id} data-testid="log-card">
            <span data-testid="entry-piece">{entry.piece}</span>
            <span data-testid="entry-step">{entry.step}</span>
            <span data-testid="entry-due-date">{entry.dueDate}</span>
            {entry.completed && <span data-testid="completed-badge">Completed</span>}
            <button
              data-testid="toggle-completed-button"
              onClick={() => toggleCompleted(entry.id)}
            >
              {entry.completed ? "Undo" : "Complete"}
            </button>
            <button
              data-testid="delete-button"
              onClick={() => deleteEntry(entry.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
