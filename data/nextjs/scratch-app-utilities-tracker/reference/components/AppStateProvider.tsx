import React, { createContext, useContext, useState } from "react";

interface AppContextValue {
  route: string;
  navigate: (route: string) => void;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  return <AppContext.Provider value={{ route, navigate: setRoute }}>{children}</AppContext.Provider>;
}
