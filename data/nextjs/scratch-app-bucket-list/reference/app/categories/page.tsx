"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function CategoriesPage() {
  const { goals } = useApp();
  const catMap: Record<string, typeof goals> = {};
  goals.forEach((g) => {
    if (!catMap[g.category]) catMap[g.category] = [];
    catMap[g.category].push(g);
  });

  return (
    <div data-testid="categories-page">
      <h2>Categories</h2>
      <p data-testid="category-count">Categories: {Object.keys(catMap).length}</p>
      <ul data-testid="category-list">
        {Object.keys(catMap).map((cat) => (
          <li key={cat} data-testid={`category-item-${cat.toLowerCase().replace(/\s+/g, "-")}`}>
            <span data-testid="category-name">{cat}</span>
            <span data-testid="category-goal-count">{catMap[cat].length} goals</span>
            <span data-testid="category-completed-count">{catMap[cat].filter((g) => g.completed).length} completed</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
