import React, { createContext, useContext } from "react";
import { Recipe } from "../lib/types";

type Route = "dashboard" | "add-recipe" | "view-recipe";

interface AppState {
  route: Route;
  selectedRecipe: Recipe | null;
  recipes: Recipe[];
  navigate: (r: Route, recipe?: Recipe) => void;
  handleAdd: (data: Omit<Recipe, "id" | "createdAt">) => void;
  handleDelete: (id: string) => void;
  refresh: () => void;
}

const Ctx = createContext<AppState>({
  route: "dashboard",
  selectedRecipe: null,
  recipes: [],
  navigate: () => {},
  handleAdd: () => {},
  handleDelete: () => {},
  refresh: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "dashboard", selectedRecipe: null, recipes: [], navigate: () => {}, handleAdd: () => {}, handleDelete: () => {}, refresh: () => {} }}>{children}</Ctx.Provider>;
}
