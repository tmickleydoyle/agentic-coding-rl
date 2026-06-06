"use client";
import React, { createContext, useContext, useState } from "react";
import type { Game, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, games: [], setGames: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [games, setGames] = useState<Game[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, games, setGames }}>{children}</AppContext.Provider>;
}
