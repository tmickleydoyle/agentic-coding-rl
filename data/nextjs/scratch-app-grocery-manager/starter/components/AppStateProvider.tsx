import React, { createContext, useContext } from "react";
import { GroceryItem } from "../lib/types";

type Route = "shopping-list" | "add-item" | "categories";

interface AppState {
  route: Route;
  items: GroceryItem[];
  navigate: (r: Route) => void;
  handleAdd: (data: Omit<GroceryItem, "id" | "checked">) => void;
  handleToggle: (id: string) => void;
  handleDelete: (id: string) => void;
}

const Ctx = createContext<AppState>({ route: "shopping-list", items: [], navigate: () => {}, handleAdd: () => {}, handleToggle: () => {}, handleDelete: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "shopping-list", items: [], navigate: () => {}, handleAdd: () => {}, handleToggle: () => {}, handleDelete: () => {} }}>{children}</Ctx.Provider>;
}
