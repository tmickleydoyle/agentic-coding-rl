"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Difficulty } from "../../lib/types";

export default function GoalsPage() {
  const { goals, setGoals } = useApp();
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const filtered = filter === "all" ? goals : goals.filter((g) => g.category === filter || g.difficulty === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/bucketlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, targetDate, difficulty }),
    });
    const goal = await res.json();
    setGoals((prev) => [...prev, goal]);
    setTitle(""); setDescription(""); setCategory(""); setTargetDate(""); setDifficulty("medium");
  }

  async function handleToggle(id: string, completed: boolean) {
    const res = await fetch("/api/bucketlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    const updated = await res.json();
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/bucketlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  const categories = Array.from(new Set(goals.map((g) => g.category)));

  return (
    <div data-testid="goals-page">
      <h2>My Goals</h2>
      <form data-testid="add-goal-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" required />
        <input data-testid="input-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="input-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <input data-testid="input-target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        <select data-testid="select-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
          <option value="extreme">extreme</option>
        </select>
        <button type="submit" data-testid="btn-add-goal">Add Goal</button>
      </form>
      <div data-testid="filter-controls">
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        {categories.map((c) => <button key={c} data-testid={`filter-${c.toLowerCase()}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>
      <ul data-testid="goal-list">
        {filtered.map((g) => (
          <li key={g.id} data-testid={`goal-item-${g.id}`}>
            <span data-testid={`goal-title-${g.id}`}>{g.title}</span>
            <span data-testid={`goal-status-${g.id}`}>{g.completed ? "completed" : "pending"}</span>
            <button data-testid={`btn-toggle-${g.id}`} onClick={() => handleToggle(g.id, g.completed)}>{g.completed ? "Mark Incomplete" : "Complete"}</button>
            <button data-testid={`btn-remove-${g.id}`} onClick={() => handleRemove(g.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
