import React, { createContext, useContext, useState, ReactNode } from "react";
import { Profile, Allocation } from "../lib/types";
import { getState, addProfile, deleteProfile, addAllocation, deleteAllocation } from "../lib/store";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  profiles: Profile[];
  allocations: Allocation[];
  addProfile: (p: Omit<Profile, "id">) => void;
  deleteProfile: (id: string) => void;
  addAllocation: (a: Omit<Allocation, "id">) => void;
  deleteAllocation: (id: string) => void;
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
  const [profiles, setProfiles] = useState<Profile[]>(initial.profiles);
  const [allocations, setAllocations] = useState<Allocation[]>(initial.allocations);

  return (
    <AppContext.Provider value={{
      route, navigate: setRoute, profiles, allocations,
      addProfile: (p) => { const n = addProfile(p); setProfiles((prev) => [...prev, n]); },
      deleteProfile: (id) => { deleteProfile(id); setProfiles((prev) => prev.filter((p) => p.id !== id)); },
      addAllocation: (a) => { const n = addAllocation(a); setAllocations((prev) => [...prev, n]); },
      deleteAllocation: (id) => { deleteAllocation(id); setAllocations((prev) => prev.filter((a) => a.id !== id)); },
    }}>
      {children}
    </AppContext.Provider>
  );
}
