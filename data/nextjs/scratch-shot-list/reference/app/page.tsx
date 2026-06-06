import React, { useState } from "react";

interface Shot {
  id: number;
  subject: string;
  type: string;
  priority: string;
  done: boolean;
}

const SEED_SHOTS: Shot[] = [
  { id: 1, subject: "Bride entrance", type: "Portrait", priority: "High", done: false },
  { id: 2, subject: "Wedding cake", type: "Detail", priority: "Medium", done: false },
  { id: 3, subject: "First dance", type: "Candid", priority: "High", done: true },
  { id: 4, subject: "Venue exterior", type: "Wide", priority: "Low", done: false },
];

const TYPES = ["Portrait", "Detail", "Candid", "Wide", "Macro"];
const PRIORITIES = ["High", "Medium", "Low"];

export default function App() {
  const [shots, setShots] = useState<Shot[]>(SEED_SHOTS);
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Portrait");
  const [priority, setPriority] = useState("Medium");
  const [showCompleted, setShowCompleted] = useState(true);
  const [nextId, setNextId] = useState(5);

  const doneCount = shots.filter((s) => s.done).length;
  const visible = showCompleted ? shots : shots.filter((s) => !s.done);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    const shot: Shot = { id: nextId, subject: subject.trim(), type, priority, done: false };
    setShots((prev) => [...prev, shot]);
    setNextId((n) => n + 1);
    setSubject("");
  }

  function deleteShot(id: number) {
    setShots((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleDone(id: number) {
    setShots((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  }

  return (
    <div>
      <h1>Shot List</h1>
      <p data-testid="summary">{doneCount} of {shots.length} completed</p>

      <form onSubmit={handleSubmit} data-testid="add-form">
        <div>
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            data-testid="input-subject"
          />
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} data-testid="input-type">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} data-testid="input-priority">
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button type="submit" data-testid="submit-btn">Add Shot</button>
      </form>

      <button
        onClick={() => setShowCompleted((v) => !v)}
        data-testid="toggle-completed"
      >
        {showCompleted ? "Hide completed" : "Show completed"}
      </button>

      <ul data-testid="shot-list">
        {visible.map((s) => (
          <li key={s.id} data-testid={`shot-${s.id}`}>
            <input
              type="checkbox"
              checked={s.done}
              onChange={() => toggleDone(s.id)}
              data-testid={`checkbox-${s.id}`}
            />
            <span data-testid={`shot-subject-${s.id}`}>{s.subject}</span>
            <span data-testid={`shot-type-${s.id}`}>{s.type}</span>
            <span data-testid={`shot-priority-${s.id}`}>{s.priority}</span>
            <button onClick={() => deleteShot(s.id)} data-testid={`delete-${s.id}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
