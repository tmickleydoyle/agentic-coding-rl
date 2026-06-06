"use client";
import React, { createContext, useContext, useState } from "react";
import type { Show, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  shows: Show[];
  setShows: React.Dispatch<React.SetStateAction<Show[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, shows: [], setShows: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [shows, setShows] = useState<Show[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, shows, setShows }}>{children}</AppContext.Provider>;
}
