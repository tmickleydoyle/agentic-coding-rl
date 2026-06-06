import React, { createContext, useContext } from "react";
import { Supplement, DoseLog } from "../lib/types";

type Route = "schedule" | "add-supplement" | "log-dose";

interface AppState {
  route: Route;
  supplements: Supplement[];
  todayLogs: DoseLog[];
  navigate: (r: Route) => void;
  handleAddSupplement: (data: Omit<Supplement, "id">) => void;
  handleDeleteSupplement: (id: string) => void;
  handleLogDose: (supplementId: string, date: string, time: string) => void;
}

const Ctx = createContext<AppState>({ route: "schedule", supplements: [], todayLogs: [], navigate: () => {}, handleAddSupplement: () => {}, handleDeleteSupplement: () => {}, handleLogDose: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "schedule", supplements: [], todayLogs: [], navigate: () => {}, handleAddSupplement: () => {}, handleDeleteSupplement: () => {}, handleLogDose: () => {} }}>{children}</Ctx.Provider>;
}
