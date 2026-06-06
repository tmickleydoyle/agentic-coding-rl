import React, { createContext, useContext, useState, useCallback } from "react";
import { PantryItem } from "../lib/types";
import { getItems, addItem, updateQuantity, deleteItem, getLowStock } from "../lib/store";

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
  const [route, setRoute] = useState<Route>("inventory");
  const [items, setItems] = useState<PantryItem[]>(() => getItems());
  const [lowStock, setLowStock] = useState<PantryItem[]>(() => getLowStock());

  const refresh = () => { setItems(getItems()); setLowStock(getLowStock()); };

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleAdd = useCallback((data: Omit<PantryItem, "id">) => {
    addItem(data); refresh(); setRoute("inventory");
  }, []);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    updateQuantity(id, delta); refresh();
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteItem(id); refresh();
  }, []);

  return (
    <Ctx.Provider value={{ route, items, lowStock, navigate, handleAdd, handleUpdateQuantity, handleDelete }}>
      {children}
    </Ctx.Provider>
  );
}
