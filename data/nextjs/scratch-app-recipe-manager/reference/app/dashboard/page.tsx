import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { Recipe } from "../../lib/types";

export function DashboardPage() {
  const { recipes, navigate } = useApp();
  return (
    <div>
      <h1>Recipe Dashboard</h1>
      <p data-testid="recipe-count">{recipes.length} recipes</p>
      <ul>
        {recipes.map((r: Recipe) => (
          <li
            key={r.id}
            data-testid="recipe-item"
            onClick={() => navigate("view-recipe", r)}
            style={{ cursor: "pointer" }}
          >
            {r.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
