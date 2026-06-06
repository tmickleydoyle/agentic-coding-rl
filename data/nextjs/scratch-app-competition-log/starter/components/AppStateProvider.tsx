import React, { createContext, useContext } from "react";
import { Competition, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  competitions: Competition[];
  activeCompetitionId: string | null;
  setActiveCompetitionId: (id: string | null) => void;
  addCompetition: (name: string, sport: string, date: string, location: string) => void;
  deleteCompetition: (id: string) => void;
  addResult: (competitionId: string, athleteName: string, place: number, score: string, notes: string) => void;
}

const Ctx = createContext<AppCtx>({
  route: "competitions",
  setRoute: () => {},
  competitions: [],
  activeCompetitionId: null,
  setActiveCompetitionId: () => {},
  addCompetition: () => {},
  deleteCompetition: () => {},
  addResult: () => {},
});

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "competitions", setRoute: () => {}, competitions: [], activeCompetitionId: null, setActiveCompetitionId: () => {}, addCompetition: () => {}, deleteCompetition: () => {}, addResult: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
