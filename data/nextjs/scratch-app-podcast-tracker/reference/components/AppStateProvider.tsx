"use client";
import React, { createContext, useContext, useState } from "react";
import type { Podcast, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  podcasts: Podcast[];
  setPodcasts: React.Dispatch<React.SetStateAction<Podcast[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, podcasts: [], setPodcasts: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, podcasts, setPodcasts }}>{children}</AppContext.Provider>;
}
