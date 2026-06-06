import React, { createContext, useContext, useState, useCallback } from "react";
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

function buildChecklist(emps: Employee[], tmpls: TaskTemplate[]): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let id = 1;
  emps.forEach((e) => {
    tmpls.forEach((t) => {
      items.push({ id: String(id++), employeeId: e.id, templateId: t.id, completed: false });
    });
  });
  return items;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const seedEmployees: Employee[] = [
    { id: "1", name: "Eve Torres", email: "eve@co.com", department: "Engineering", startDate: "2024-02-01", managerId: "" },
    { id: "2", name: "Frank Liu", email: "frank@co.com", department: "Marketing", startDate: "2024-02-05", managerId: "" },
  ];
  const seedTemplates: TaskTemplate[] = [
    { id: "1", title: "Sign offer letter", description: "DocuSign the offer", dueOffset: 1, category: "HR" },
    { id: "2", title: "Setup laptop", description: "IT setup and config", dueOffset: 1, category: "IT" },
    { id: "3", title: "Complete I-9", description: "Fill out I-9 form", dueOffset: 3, category: "Legal" },
    { id: "4", title: "Team intro meeting", description: "Meet the team", dueOffset: 5, category: "Culture" },
  ];
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [templates, setTemplates] = useState<TaskTemplate[]>(seedTemplates);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(buildChecklist(seedEmployees, seedTemplates));
  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, employees, templates, checklist, setEmployees, setTemplates, setChecklist }}>
      {children}
    </AppContext.Provider>
  );
}
