import React, { useState } from "react";
import { getGoals, getMentors, toggleGoal } from "../../lib/store";

type FilterType = "all" | "incomplete" | "complete";

export function GoalsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [, forceUpdate] = useState(0);

  const mentors = getMentors();
  const goals = getGoals();
  const mentorMap = new Map<string, string>();
  mentors.forEach((m) => mentorMap.set(m.id, m.name));

  const filtered = goals.filter((g) => {
    if (filter === "incomplete") return !g.completed;
    if (filter === "complete") return g.completed;
    return true;
  });

  return (
    <div data-testid="goals-page">
      <h2>Goals</h2>
      <div>
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        <button data-testid="filter-incomplete" onClick={() => setFilter("incomplete")}>Incomplete</button>
        <button data-testid="filter-complete" onClick={() => setFilter("complete")}>Complete</button>
      </div>
      {filtered.map((g) => (
        <div key={g.id} data-testid="goal-item">
          <span data-testid="goal-title">{g.title}</span>
          <span data-testid="goal-due">{g.dueDate}</span>
          <span data-testid="goal-mentor">{mentorMap.get(g.mentorId) ?? ""}</span>
          {g.completed && <span data-testid="goal-completed-badge">Completed</span>}
          <input
            type="checkbox"
            data-testid="goal-complete"
            checked={g.completed}
            onChange={() => { toggleGoal(g.id); forceUpdate((n) => n + 1); }}
          />
        </div>
      ))}
    </div>
  );
}
