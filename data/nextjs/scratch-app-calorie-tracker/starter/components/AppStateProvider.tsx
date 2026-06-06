import React, { createContext, useContext } from "react";
import { FoodLog, Goals } from "../lib/types";

type Route = "tracker" | "add-food" | "goals";
interface TotalsType { calories: number; protein: number; carbs: number; fat: number; }

interface AppState {
  route: Route;
  logs: FoodLog[];
  goals: Goals;
  todayTotal: TotalsType;
  navigate: (r: Route) => void;
  handleAdd: (data: Omit<FoodLog, "id">) => void;
  handleDelete: (id: string) => void;
  handleSetGoals: (g: Goals) => void;
}

const Ctx = createContext<AppState>({ route: "tracker", logs: [], goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 }, todayTotal: { calories: 0, protein: 0, carbs: 0, fat: 0 }, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {}, handleSetGoals: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "tracker", logs: [], goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 }, todayTotal: { calories: 0, protein: 0, carbs: 0, fat: 0 }, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {}, handleSetGoals: () => {} }}>{children}</Ctx.Provider>;
}
