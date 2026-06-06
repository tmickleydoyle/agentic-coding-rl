"use client";
import React, { createContext, useContext, useState } from "react";
import type { Movie, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, movies: [], setMovies: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [movies, setMovies] = useState<Movie[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, movies, setMovies }}>{children}</AppContext.Provider>;
}
