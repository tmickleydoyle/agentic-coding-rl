import React, { createContext, useContext, useState, ReactNode } from "react";
import { Profile, Allocation } from "../lib/types";

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

const AppContext = createContext<AppContextType>({
  route: "/", navigate: () => {},
  profiles: [], allocations: [],
  addProfile: () => {}, deleteProfile: () => {},
  addAllocation: () => {}, deleteAllocation: () => {},
});

export function useApp(): AppContextType {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState("/");
  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      profiles: [], allocations: [],
      addProfile: () => {}, deleteProfile: () => {},
      addAllocation: () => {}, deleteAllocation: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
