import React, { createContext, useContext } from "react";
import { WaterEntry } from "../lib/types";

type Route = "dashboard" | "log-water" | "history";

interface AppState {
  route: Route;
  entries: WaterEntry[];
  todayTotal: number;
  dailyGoal: number;
  navigate: (r: Route) => void;
  handleAdd: (data: Omit<WaterEntry, "id">) => void;
  handleDelete: (id: string) => void;
  handleSetGoal: (cups: number) => void;
}

const Ctx = createContext<AppState>({ route: "dashboard", entries: [], todayTotal: 0, dailyGoal: 8, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {}, handleSetGoal: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "dashboard", entries: [], todayTotal: 0, dailyGoal: 8, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {}, handleSetGoal: () => {} }}>{children}</Ctx.Provider>;
}
