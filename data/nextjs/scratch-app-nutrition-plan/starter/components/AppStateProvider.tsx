import React, { createContext, useContext } from "react";
import { Meal, MealTime, DailyTargets, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  meals: Meal[];
  activeMealId: string | null;
  setActiveMealId: (id: string | null) => void;
  targets: DailyTargets;
  addMeal: (name: string, time: MealTime) => void;
  deleteMeal: (id: string) => void;
  addFood: (mealId: string, name: string, calories: number, protein: number, carbs: number, fat: number) => void;
  saveTargets: (t: DailyTargets) => void;
}

const Ctx = createContext<AppCtx>({
  route: "meals",
  setRoute: () => {},
  meals: [],
  activeMealId: null,
  setActiveMealId: () => {},
  targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
  addMeal: () => {},
  deleteMeal: () => {},
  addFood: () => {},
  saveTargets: () => {},
});

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "meals", setRoute: () => {}, meals: [], activeMealId: null, setActiveMealId: () => {}, targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 }, addMeal: () => {}, deleteMeal: () => {}, addFood: () => {}, saveTargets: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
