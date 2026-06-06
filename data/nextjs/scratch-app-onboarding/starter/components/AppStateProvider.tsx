import React, { createContext, useContext } from "react";
import { Employee, TaskTemplate, ChecklistItem } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  employees: Employee[];
  templates: TaskTemplate[];
  checklist: ChecklistItem[];
  setEmployees: (v: Employee[]) => void;
  setTemplates: (v: TaskTemplate[]) => void;
  setChecklist: (v: ChecklistItem[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  employees: [],
  templates: [],
  checklist: [],
  setEmployees: () => {},
  setTemplates: () => {},
  setChecklist: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, employees: [], templates: [], checklist: [], setEmployees: () => {}, setTemplates: () => {}, setChecklist: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
