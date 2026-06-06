import React, { createContext, useContext, useState, useCallback } from "react";
import { MealEntry } from "../lib/types";
import { getMeals, addMeal, deleteMeal } from "../lib/store";

type Route = "weekly-plan" | "add-meal" | "meal-detail";

interface AppState {
  route: Route;
  selectedMeal: MealEntry | null;
  meals: MealEntry[];
  navigate: (r: Route, meal?: MealEntry) => void;
  handleAdd: (data: Omit<MealEntry, "id">) => void;
  handleDelete: (id: string) => void;
}

const Ctx = createContext<AppState>({
  route: "weekly-plan",
  selectedMeal: null,
  meals: [],
  navigate: () => {},
  handleAdd: () => {},
  handleDelete: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("weekly-plan");
  const [selectedMeal, setSelectedMeal] = useState<MealEntry | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>(() => getMeals());

  const navigate = useCallback((r: Route, meal?: MealEntry) => {
    setRoute(r);
    if (meal) setSelectedMeal(meal);
  }, []);

  const handleAdd = useCallback((data: Omit<MealEntry, "id">) => {
    addMeal(data);
    setMeals(getMeals());
    setRoute("weekly-plan");
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteMeal(id);
    setMeals(getMeals());
    setRoute("weekly-plan");
  }, []);

  return (
    <Ctx.Provider value={{ route, selectedMeal, meals, navigate, handleAdd, handleDelete }}>
      {children}
    </Ctx.Provider>
  );
}
