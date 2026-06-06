import React, { createContext, useContext, useState, useCallback } from "react";
import { Supplement, DoseLog } from "../lib/types";
import { getSupplements, addSupplement, deleteSupplement, getTodayLogs, logDose } from "../lib/store";

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
  const [route, setRoute] = useState<Route>("schedule");
  const [supplements, setSupplements] = useState<Supplement[]>(() => getSupplements());
  const [todayLogs, setTodayLogs] = useState<DoseLog[]>(() => getTodayLogs());

  const refresh = () => { setSupplements(getSupplements()); setTodayLogs(getTodayLogs()); };

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleAddSupplement = useCallback((data: Omit<Supplement, "id">) => {
    addSupplement(data); refresh(); setRoute("schedule");
  }, []);

  const handleDeleteSupplement = useCallback((id: string) => {
    deleteSupplement(id); refresh();
  }, []);

  const handleLogDose = useCallback((supplementId: string, date: string, time: string) => {
    logDose(supplementId, date, time); setTodayLogs(getTodayLogs()); setRoute("schedule");
  }, []);

  return (
    <Ctx.Provider value={{ route, supplements, todayLogs, navigate, handleAddSupplement, handleDeleteSupplement, handleLogDose }}>
      {children}
    </Ctx.Provider>
  );
}
