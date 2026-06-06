import React, { createContext, useContext } from "react";
import { DietEntry } from "../lib/types";

type Route = "log" | "add-entry" | "summary";
interface Summary { calories: number; protein: number; carbs: number; fat: number; }

interface AppState {
  route: Route;
  entries: DietEntry[];
  summary: Summary;
  navigate: (r: Route) => void;
  handleAdd: (data: Omit<DietEntry, "id">) => void;
  handleDelete: (id: string) => void;
}

const Ctx = createContext<AppState>({ route: "log", entries: [], summary: { calories: 0, protein: 0, carbs: 0, fat: 0 }, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "log", entries: [], summary: { calories: 0, protein: 0, carbs: 0, fat: 0 }, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {} }}>{children}</Ctx.Provider>;
}
