import React, { createContext, useContext, useState } from "react";
import type { Route, Assignment, StudyNote } from "../lib/types";
import { getAssignments, getNotes } from "../lib/store";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  assignments: Assignment[];
  setAssignments: (a: Assignment[]) => void;
  notes: StudyNote[];
  setNotes: (n: StudyNote[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  assignments: [],
  setAssignments: () => {},
  notes: [],
  setNotes: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [assignments, setAssignments] = useState<Assignment[]>(getAssignments());
  const [notes, setNotes] = useState<StudyNote[]>(getNotes());
  return (
    <AppContext.Provider value={{ route, setRoute, assignments, setAssignments, notes, setNotes }}>
      {children}
    </AppContext.Provider>
  );
}
