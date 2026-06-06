import React, { createContext, useContext, useState, useCallback } from "react";
import type { PackingList } from "../lib/types";

interface AppState {
  route: string;
  lists: PackingList[];
  navigate: (r: string) => void;
  addList: (l: PackingList) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  lists: [],
  navigate: () => {},
  addList: () => {},
});

const SEED: PackingList[] = [
  {
    id: "1", tripName: "Japan Trip", destination: "Tokyo", departureDate: "2024-03-15",
    items: [
      { id: "i1", name: "Passport", category: "Documents", checked: true, quantity: 1 },
      { id: "i2", name: "T-Shirts", category: "Clothing", checked: false, quantity: 5 },
      { id: "i3", name: "Charger", category: "Electronics", checked: true, quantity: 1 },
    ],
  },
  {
    id: "2", tripName: "Italy Tour", destination: "Rome", departureDate: "2024-05-02",
    items: [
      { id: "i4", name: "Sunscreen", category: "Toiletries", checked: false, quantity: 2 },
      { id: "i5", name: "Camera", category: "Electronics", checked: false, quantity: 1 },
    ],
  },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [lists, setLists] = useState<PackingList[]>(SEED.map((l) => ({ ...l, items: l.items.map((i) => ({ ...i })) })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addList = useCallback((l: PackingList) => setLists((prev) => [...prev, l]), []);
  return (
    <AppContext.Provider value={{ route, lists, navigate, addList }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
