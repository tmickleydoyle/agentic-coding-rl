import React, { createContext, useContext, useState, useCallback } from "react";
import { GroceryItem } from "../lib/types";
import { getItems, addItem, toggleItem, deleteItem } from "../lib/store";

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
  const [route, setRoute] = useState<Route>("shopping-list");
  const [items, setItems] = useState<GroceryItem[]>(() => getItems());

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleAdd = useCallback((data: Omit<GroceryItem, "id" | "checked">) => {
    addItem(data);
    setItems(getItems());
    setRoute("shopping-list");
  }, []);

  const handleToggle = useCallback((id: string) => {
    toggleItem(id);
    setItems(getItems());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteItem(id);
    setItems(getItems());
  }, []);

  return (
    <Ctx.Provider value={{ route, items, navigate, handleAdd, handleToggle, handleDelete }}>
      {children}
    </Ctx.Provider>
  );
}
