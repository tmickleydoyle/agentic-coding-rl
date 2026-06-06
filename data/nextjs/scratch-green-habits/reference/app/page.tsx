import React, { useState } from "react";

interface Habit {
  id: number;
  name: string;
  category: string;
  target: number;
  completed: number;
}

const CATEGORIES = ["Shopping", "Transport", "Food", "Home", "Energy", "Other"];

const SEED: Habit[] = [
  { id: 1, name: "Bring reusable bag", category: "Shopping", target: 3, completed: 2 },
  { id: 2, name: "Bike instead of drive", category: "Transport", target: 5, completed: 3 },
  { id: 3, name: "Meatless Monday", category: "Food", target: 1, completed: 1 },
  { id: 4, name: "Shorter showers", category: "Home", target: 7, completed: 4 },
];

let nextId = 5;

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(SEED);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  function handleAdd() {
    if (!name || target === "") {
      setError("Name and target are required");
      return;
    }
    const tgt = parseInt(target, 10);
    if (isNaN(tgt) || tgt < 1 || tgt > 7) {
      setError("Target must be between 1 and 7");
      return;
    }
    setError("");
    setHabits((prev) => [
      ...prev,
      { id: nextId++, name, category, target: tgt, completed: 0 },
    ]);
    setName("");
    setCategory("Shopping");
    setTarget("");
  }

  function handleDelete(id: number) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function handleIncrement(id: number) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, completed: Math.min(h.completed + 1, h.target) }
          : h
      )
    );
  }

  const filtered =
    catFilter === "All" ? habits : habits.filter((h) => h.category === catFilter);

  const totalHabits = habits.length;
  const onTrackCount = habits.filter((h) => h.completed >= h.target).length;
  const sumCompleted = habits.reduce((s, h) => s + h.completed, 0);
  const sumTargets = habits.reduce((s, h) => s + h.target, 0);
  const pct = sumTargets > 0 ? Math.round((sumCompleted / sumTargets) * 100) : 0;

  return (
    <div>
      <h1>Green Habits Tracker</h1>

      <div>
        <label htmlFor="name-input">Name</label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="name-input"
        />
        <label htmlFor="category-select">Category</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data-testid="category-select"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label htmlFor="target-input">Target days/week</label>
        <input
          id="target-input"
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          data-testid="target-input"
        />
        <button onClick={handleAdd} data-testid="add-button">
          Add Habit
        </button>
        {error && <p data-testid="error-message">{error}</p>}
      </div>

      <div>
        <label htmlFor="cat-filter">Filter by category</label>
        <select
          id="cat-filter"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          data-testid="cat-filter"
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div data-testid="summary">
        <span data-testid="total-habits">{totalHabits}</span>
        <span data-testid="on-track-count">{onTrackCount}</span>
        <span data-testid="completion-pct">{pct}%</span>
      </div>

      <ul data-testid="habit-list">
        {filtered.map((habit) => (
          <li key={habit.id} data-testid={`habit-${habit.id}`}>
            <span data-testid={`habit-name-${habit.id}`}>{habit.name}</span>
            <span data-testid={`habit-category-${habit.id}`}>{habit.category}</span>
            <span data-testid={`habit-completed-${habit.id}`}>{habit.completed}</span>
            <span data-testid={`habit-target-${habit.id}`}>{habit.target}</span>
            <span data-testid={`habit-status-${habit.id}`}>
              {habit.completed >= habit.target ? "On Track" : "Behind"}
            </span>
            <button
              onClick={() => handleIncrement(habit.id)}
              data-testid={`increment-${habit.id}`}
            >
              +
            </button>
            <button
              onClick={() => handleDelete(habit.id)}
              data-testid={`delete-${habit.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
