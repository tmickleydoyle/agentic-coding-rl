import React, { createContext, useContext, useState, ReactNode } from "react";
import { ExecutorTask, Contact, TaskStatus } from "../lib/types";
import { getState, addTask, deleteTask, updateTaskStatus, addContact, deleteContact } from "../lib/store";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  tasks: ExecutorTask[];
  contacts: Contact[];
  addTask: (t: Omit<ExecutorTask, "id">) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addContact: (c: Omit<Contact, "id">) => void;
  deleteContact: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppStateProvider");
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const initial = getState();
  const [route, setRoute] = useState("/");
  const [tasks, setTasks] = useState<ExecutorTask[]>(initial.tasks);
  const [contacts, setContacts] = useState<Contact[]>(initial.contacts);

  return (
    <AppContext.Provider value={{
      route, navigate: setRoute, tasks, contacts,
      addTask: (t) => { const n = addTask(t); setTasks((p) => [...p, n]); },
      deleteTask: (id) => { deleteTask(id); setTasks((p) => p.filter((t) => t.id !== id)); },
      updateTaskStatus: (id, status) => {
        updateTaskStatus(id, status);
        setTasks((p) => p.map((t) => (t.id === id ? { ...t, status } : t)));
      },
      addContact: (c) => { const n = addContact(c); setContacts((p) => [...p, n]); },
      deleteContact: (id) => { deleteContact(id); setContacts((p) => p.filter((c) => c.id !== id)); },
    }}>
      {children}
    </AppContext.Provider>
  );
}
