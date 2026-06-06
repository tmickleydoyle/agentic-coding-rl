import React, { createContext, useContext, useState, useCallback } from "react";
import { FoodLog, Goals } from "../lib/types";
import { getLogs, addLog, deleteLog, getGoals, setGoals, getTodayTotal } from "../lib/store";

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
  const [route, setRoute] = useState<Route>("tracker");
  const [logs, setLogs] = useState<FoodLog[]>(() => getLogs());
  const [goals, setGoalsState] = useState<Goals>(() => getGoals());
  const [todayTotal, setTodayTotal] = useState<TotalsType>(() => getTodayTotal());

  const refresh = () => { setLogs(getLogs()); setTodayTotal(getTodayTotal()); };

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleAdd = useCallback((data: Omit<FoodLog, "id">) => {
    addLog(data); refresh(); setRoute("tracker");
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteLog(id); refresh();
  }, []);

  const handleSetGoals = useCallback((g: Goals) => {
    setGoals(g); setGoalsState(getGoals());
  }, []);

  return (
    <Ctx.Provider value={{ route, logs, goals, todayTotal, navigate, handleAdd, handleDelete, handleSetGoals }}>
      {children}
    </Ctx.Provider>
  );
}
