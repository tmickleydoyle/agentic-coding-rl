"use client";
import React, { createContext, useContext, useState } from "react";
import type { Book, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  books: [],
  setBooks: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [books, setBooks] = useState<Book[]>([]);

  function navigate(r: Route) {
    setRoute(r);
  }

  return (
    <AppContext.Provider value={{ route, navigate, books, setBooks }}>
      {children}
    </AppContext.Provider>
  );
}
