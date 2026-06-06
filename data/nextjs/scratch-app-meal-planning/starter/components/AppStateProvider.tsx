import React, { createContext, useContext } from "react";
import { MealEntry } from "../lib/types";

type Route = "weekly-plan" | "add-meal" | "meal-detail";

interface AppState {
  route: Route;
  selectedMeal: MealEntry | null;
  meals: MealEntry[];
  navigate: (r: Route, meal?: MealEntry) => void;
  handleAdd: (data: Omit<MealEntry, "id">) => void;
  handleDelete: (id: string) => void;
}

const Ctx = createContext<AppState>({ route: "weekly-plan", selectedMeal: null, meals: [], navigate: () => {}, handleAdd: () => {}, handleDelete: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "weekly-plan", selectedMeal: null, meals: [], navigate: () => {}, handleAdd: () => {}, handleDelete: () => {} }}>{children}</Ctx.Provider>;
}
