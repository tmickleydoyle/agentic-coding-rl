import React, { useState } from "react";

type Module = "auth" | "ui" | "types" | "data";
type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  name: string;
  module: Module;
  priority: Priority;
  progress: number;
  savedProgress: number;
  assignee: string;
  done: boolean;
}

const SEED: Task[] = [
  { id: 1, name: "Extract auth service", module: "auth", priority: "high", progress: 80, savedProgress: 80, assignee: "alice", done: false },
  { id: 2, name: "Split monolithic component", module: "ui", priority: "medium", progress: 40, savedProgress: 40, assignee: "bob", done: false },
  { id: 3, name: "Move types to shared folder", module: "types", priority: "low", progress: 100, savedProgress: 100, assignee: "carol", done: true },
  { id: 4, name: "Replace class with hooks", module: "ui", priority: "high", progress: 60, savedProgress: 60, assignee: "alice", done: false },
  { id: 5, name: "Add barrel exports", module: "types", priority: "low", progress: 100, savedProgress: 100, assignee: "dave", done: true },
  { id: 6, name: "Optimize database queries", module: "data", priority: "high", progress: 20, savedProgress: 20, assignee: "bob", done: false },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "#ef4444",
  medium: "#f97316",
  low: "#22c55e",
};

type ModuleFilter = "all" | Module;
type PriorityFilter = "all" | Priority;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [nextId, setNextId] = useState(7);

  const [name, setName] = useState("");
  const [module, setModule] = useState<Module>("auth");
  const [priority, setPriority] = useState<Priority>("medium");
  const [progress, setProgress] = useState(0);
  const [assignee, setAssignee] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    const newTask: Task = {
      id: nextId,
      name: name.trim(),
      module,
      priority,
      progress,
      savedProgress: progress,
      assignee: assignee.trim(),
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNextId((n) => n + 1);
    setName("");
    setModule("auth");
    setPriority("medium");
    setProgress(0);
    setAssignee("");
  };

  const handleToggleDone = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.done) {
          return { ...t, done: true, savedProgress: t.progress, progress: 100 };
        } else {
          return { ...t, done: false, progress: t.savedProgress };
        }
      })
    );
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    const modMatch = moduleFilter === "all" || t.module === moduleFilter;
    const priMatch = priorityFilter === "all" || t.priority === priorityFilter;
    return modMatch && priMatch;
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const avgProgress = total === 0 ? "0.0" : (tasks.reduce((sum, t) => sum + t.progress, 0) / total).toFixed(1);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Refactor Tracker</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <span data-testid="stat-total">Total: {total}</span>
        <span data-testid="stat-done">Done: {done}</span>
        <span data-testid="stat-avg-progress">Avg Progress: {avgProgress}</span>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all" onClick={() => setModuleFilter("all")}>All</button>
        <button data-testid="filter-auth" onClick={() => setModuleFilter("auth")}>Auth</button>
        <button data-testid="filter-ui" onClick={() => setModuleFilter("ui")}>UI</button>
        <button data-testid="filter-types" onClick={() => setModuleFilter("types")}>Types</button>
        <button data-testid="filter-data" onClick={() => setModuleFilter("data")}>Data</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all-priority" onClick={() => setPriorityFilter("all")}>All Priority</button>
        <button data-testid="filter-high" onClick={() => setPriorityFilter("high")}>High</button>
        <button data-testid="filter-medium" onClick={() => setPriorityFilter("medium")}>Medium</button>
        <button data-testid="filter-low" onClick={() => setPriorityFilter("low")}>Low</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          data-testid="input-name"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          data-testid="select-module"
          value={module}
          onChange={(e) => setModule(e.target.value as Module)}
        >
          <option value="auth">auth</option>
          <option value="ui">ui</option>
          <option value="types">types</option>
          <option value="data">data</option>
        </select>
        <select
          data-testid="select-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input
          data-testid="input-progress"
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
        <input
          data-testid="input-assignee"
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
        <button data-testid="btn-add-task" onClick={handleAdd}>Add Task</button>
      </div>

      <div>
        {filtered.map((t) => (
          <div
            key={t.id}
            data-testid={`task-card-${t.id}`}
            style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "0.75rem", marginBottom: "0.5rem" }}
          >
            <div>
              <strong>{t.name}</strong>
              {t.done && (
                <span
                  data-testid={`done-badge-${t.id}`}
                  style={{ marginLeft: "0.5rem", background: "#22c55e", color: "#fff", padding: "2px 6px", borderRadius: "4px" }}
                >
                  Done
                </span>
              )}
            </div>
            <div>
              Module: <span data-testid={`module-${t.id}`}>{t.module}</span>
            </div>
            <div>
              Priority:{" "}
              <span
                data-testid={`priority-badge-${t.id}`}
                style={{ background: PRIORITY_COLORS[t.priority], color: "#fff", padding: "2px 6px", borderRadius: "4px" }}
              >
                {t.priority}
              </span>
            </div>
            <div>
              Progress: <span data-testid={`progress-${t.id}`}>{t.progress}</span>%
            </div>
            <div>
              Assignee: <span data-testid={`assignee-${t.id}`}>{t.assignee}</span>
            </div>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button data-testid={`btn-done-${t.id}`} onClick={() => handleToggleDone(t.id)}>
                {t.done ? "Mark Open" : "Mark Done"}
              </button>
              <button data-testid={`btn-delete-${t.id}`} onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
