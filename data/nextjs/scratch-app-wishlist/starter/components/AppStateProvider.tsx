"use client";
import React, { createContext, useContext, useState } from "react";
import type { WishItem, Category, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  items: WishItem[];
  setItems: React.Dispatch<React.SetStateAction<WishItem[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, items: [], setItems: () => {}, categories: [], setCategories: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [items, setItems] = useState<WishItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, items, setItems, categories, setCategories }}>{children}</AppContext.Provider>;
}
