import React, { createContext, useContext } from "react";
import { Injury, InjuryType, Severity, TreatmentType, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  injuries: Injury[];
  activeInjuryId: string | null;
  setActiveInjuryId: (id: string | null) => void;
  addInjury: (bodyPart: string, type: InjuryType, severity: Severity, date: string) => void;
  deleteInjury: (id: string) => void;
  addTreatment: (injuryId: string, type: TreatmentType, date: string, duration: number) => void;
  addNote: (injuryId: string, text: string, date: string) => void;
}

const Ctx = createContext<AppCtx>({
  route: "injuries",
  setRoute: () => {},
  injuries: [],
  activeInjuryId: null,
  setActiveInjuryId: () => {},
  addInjury: () => {},
  deleteInjury: () => {},
  addTreatment: () => {},
  addNote: () => {},
});

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "injuries", setRoute: () => {}, injuries: [], activeInjuryId: null, setActiveInjuryId: () => {}, addInjury: () => {}, deleteInjury: () => {}, addTreatment: () => {}, addNote: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
