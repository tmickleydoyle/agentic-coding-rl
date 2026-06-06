"use client";
import React, { createContext, useContext, useState } from "react";
import type { Goal, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, goals: [], setGoals: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [goals, setGoals] = useState<Goal[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, goals, setGoals }}>{children}</AppContext.Provider>;
}
