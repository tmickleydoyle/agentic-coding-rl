import React, { createContext, useContext, useState, useCallback } from "react";
import { WaterEntry } from "../lib/types";
import { getEntries, addEntry, deleteEntry, getTodayTotal, getDailyGoal, setDailyGoal } from "../lib/store";

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
  const [route, setRoute] = useState<Route>("dashboard");
  const [entries, setEntries] = useState<WaterEntry[]>(() => getEntries());
  const [todayTotal, setTodayTotal] = useState<number>(() => getTodayTotal());
  const [dailyGoal, setDailyGoalState] = useState<number>(() => getDailyGoal());

  const refresh = () => { setEntries(getEntries()); setTodayTotal(getTodayTotal()); };

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleAdd = useCallback((data: Omit<WaterEntry, "id">) => {
    addEntry(data); refresh(); setRoute("dashboard");
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id); refresh();
  }, []);

  const handleSetGoal = useCallback((cups: number) => {
    setDailyGoal(cups); setDailyGoalState(getDailyGoal());
  }, []);

  return (
    <Ctx.Provider value={{ route, entries, todayTotal, dailyGoal, navigate, handleAdd, handleDelete, handleSetGoal }}>
      {children}
    </Ctx.Provider>
  );
}
