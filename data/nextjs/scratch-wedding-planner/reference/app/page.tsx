import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
}

const SEED_TASKS: Task[] = [
  { id: 1, title: "Book wedding venue", category: "Venue", dueDate: "2025-01-15", completed: false },
  { id: 2, title: "Arrange catering", category: "Venue", dueDate: "2025-02-01", completed: false },
  { id: 3, title: "Buy wedding dress", category: "Attire", dueDate: "2025-03-01", completed: true },
  { id: 4, title: "Order suits for groomsmen", category: "Attire", dueDate: "2025-03-15", completed: false },
  { id: 5, title: "Hire DJ or band", category: "Music", dueDate: "2025-04-01", completed: false },
  { id: 6, title: "Create playlist", category: "Music", dueDate: "2025-05-01", completed: false },
  { id: 7, title: "Book photographer", category: "Photography", dueDate: "2025-01-30", completed: true },
  { id: 8, title: "Schedule engagement shoot", category: "Photography", dueDate: "2025-02-15", completed: false },
];

type Filter = "All" | "Pending" | "Completed";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [filter, setFilter] = useState<Filter>("All");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Venue");
  const [newDueDate, setNewDueDate] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Pending") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const categories = Array.from(new Set(tasks.map((t) => t.category))).sort();

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSave = () => {
    if (!newTitle.trim()) return;
    const categoryValue = newCategory === "__new__" ? customCategory.trim() : newCategory;
    if (!categoryValue) return;
    const maxId = tasks.reduce((m, t) => Math.max(m, t.id), 0);
    const task: Task = {
      id: maxId + 1,
      title: newTitle.trim(),
      category: categoryValue,
      dueDate: newDueDate,
      completed: false,
    };
    setTasks((prev) => [...prev, task]);
    setNewTitle("");
    setNewDueDate("");
    setNewCategory("Venue");
    setCustomCategory("");
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewTitle("");
    setNewDueDate("");
    setNewCategory("Venue");
    setCustomCategory("");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Wedding Planner</h1>

      <div data-testid="summary" style={{ marginBottom: 16, fontSize: 16, fontWeight: "bold" }}>
        {completedCount} of {tasks.length} tasks complete
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {(["All", "Pending", "Completed"] as Filter[]).map((f) => (
          <button
            key={f}
            data-testid={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}
          >
            {f}
          </button>
        ))}
      </div>

      {categories.map((cat) => {
        const catTasks = filteredTasks
          .filter((t) => t.category === cat)
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        if (catTasks.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: 24 }}>
            <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: 4 }}>{cat}</h2>
            {catTasks.map((task) => (
              <div
                key={task.id}
                data-testid={`task-${task.id}`}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
              >
                <input
                  type="checkbox"
                  data-testid={`checkbox-${task.id}`}
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span style={{ textDecoration: task.completed ? "line-through" : "none", flex: 1 }}>
                  {task.title}
                </span>
                <span style={{ color: "#888", fontSize: 13 }}>Due: {task.dueDate}</span>
              </div>
            ))}
          </div>
        );
      })}

      {!showForm && (
        <button data-testid="add-task-btn" onClick={() => setShowForm(true)}>
          Add Task
        </button>
      )}

      {showForm && (
        <div data-testid="add-form" style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
          <div style={{ marginBottom: 8 }}>
            <label>
              Title:{" "}
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                aria-label="Title"
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Category:{" "}
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                aria-label="Category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__new__">New Category</option>
              </select>
            </label>
          </div>
          {newCategory === "__new__" && (
            <div style={{ marginBottom: 8 }}>
              <label>
                New Category Name:{" "}
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  aria-label="New Category Name"
                />
              </label>
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <label>
              Due Date:{" "}
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                aria-label="Due Date"
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
