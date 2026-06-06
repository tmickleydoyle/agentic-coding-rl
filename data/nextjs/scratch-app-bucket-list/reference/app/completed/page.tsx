"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function CompletedPage() {
  const { goals } = useApp();
  const completed = goals.filter((g) => g.completed).sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));

  return (
    <div data-testid="completed-page">
      <h2>Completed Goals</h2>
      <p data-testid="completed-count">Achieved: {completed.length}</p>
      <ul data-testid="completed-list">
        {completed.map((g) => (
          <li key={g.id} data-testid={`completed-item-${g.id}`}>
            <span data-testid={`completed-title-${g.id}`}>{g.title}</span>
            <span data-testid={`completed-date-${g.id}`}>{g.completedAt}</span>
            <span data-testid={`completed-category-${g.id}`}>{g.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
