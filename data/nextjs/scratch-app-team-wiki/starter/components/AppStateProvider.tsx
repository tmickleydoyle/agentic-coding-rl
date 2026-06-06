import React, { createContext, useContext } from "react";
import { WikiPage, WikiCategory } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  pages: WikiPage[];
  categories: WikiCategory[];
  setPages: (v: WikiPage[]) => void;
  setCategories: (v: WikiCategory[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  pages: [],
  categories: [],
  setPages: () => {},
  setCategories: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, pages: [], categories: [], setPages: () => {}, setCategories: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
