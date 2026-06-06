import React, { createContext, useContext, useState, useCallback } from "react";
import { Recipe } from "../lib/types";
import { getRecipes, addRecipe, deleteRecipe } from "../lib/store";

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
  const [route, setRoute] = useState<Route>("dashboard");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>(() => getRecipes());

  const refresh = useCallback(() => {
    setRecipes(getRecipes());
  }, []);

  const navigate = useCallback((r: Route, recipe?: Recipe) => {
    setRoute(r);
    if (recipe) setSelectedRecipe(recipe);
  }, []);

  const handleAdd = useCallback((data: Omit<Recipe, "id" | "createdAt">) => {
    addRecipe(data);
    setRecipes(getRecipes());
    setRoute("dashboard");
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteRecipe(id);
    setRecipes(getRecipes());
    setRoute("dashboard");
  }, []);

  return (
    <Ctx.Provider value={{ route, selectedRecipe, recipes, navigate, handleAdd, handleDelete, refresh }}>
      {children}
    </Ctx.Provider>
  );
}
