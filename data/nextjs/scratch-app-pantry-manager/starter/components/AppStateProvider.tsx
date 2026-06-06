import React, { createContext, useContext } from "react";
import { PantryItem } from "../lib/types";

type Route = "inventory" | "add-item" | "low-stock";

interface AppState {
  route: Route;
  items: PantryItem[];
  lowStock: PantryItem[];
  navigate: (r: Route) => void;
  handleAdd: (data: Omit<PantryItem, "id">) => void;
  handleUpdateQuantity: (id: string, delta: number) => void;
  handleDelete: (id: string) => void;
}

const Ctx = createContext<AppState>({ route: "inventory", items: [], lowStock: [], navigate: () => {}, handleAdd: () => {}, handleUpdateQuantity: () => {}, handleDelete: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ route: "inventory", items: [], lowStock: [], navigate: () => {}, handleAdd: () => {}, handleUpdateQuantity: () => {}, handleDelete: () => {} }}>{children}</Ctx.Provider>;
}
