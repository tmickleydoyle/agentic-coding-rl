import React, { createContext, useContext, useState, useCallback } from "react";
import { Metric, Goal, HistoryEntry } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  metrics: Metric[];
  goals: Goal[];
  history: HistoryEntry[];
  setMetrics: (v: Metric[]) => void;
  setGoals: (v: Goal[]) => void;
  setHistory: (v: HistoryEntry[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  metrics: [],
  goals: [],
  history: [],
  setMetrics: () => {},
  setGoals: () => {},
  setHistory: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: "1", name: "MRR", category: "Revenue", unit: "currency", currentValue: 45000, targetValue: 60000 },
    { id: "2", name: "Churn Rate", category: "Revenue", unit: "percent", currentValue: 3.2, targetValue: 2.0 },
    { id: "3", name: "DAU", category: "Engagement", unit: "number", currentValue: 1200, targetValue: 2000 },
    { id: "4", name: "NPS", category: "Engagement", unit: "number", currentValue: 42, targetValue: 50 },
  ]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", metricId: "1", quarter: "Q2", year: 2024, targetValue: 55000 },
    { id: "2", metricId: "3", quarter: "Q2", year: 2024, targetValue: 1500 },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, metrics, goals, history, setMetrics, setGoals, setHistory }}>
      {children}
    </AppContext.Provider>
  );
}
