import React, { createContext, useContext, useState, useCallback } from "react";
import type { Trip } from "../lib/types";

interface AppState {
  route: string;
  trips: Trip[];
  navigate: (r: string) => void;
  addTrip: (t: Trip) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  trips: [],
  navigate: () => {},
  addTrip: () => {},
});

const SEED: Trip[] = [
  { id: "1", name: "Spring Break", destination: "Barcelona", startDate: "2024-04-01", endDate: "2024-04-10", status: "done", notes: "Great trip!" },
  { id: "2", name: "Summer Holiday", destination: "Greece", startDate: "2024-07-15", endDate: "2024-07-30", status: "planned", notes: "Book hotels." },
  { id: "3", name: "Work Trip", destination: "London", startDate: "2024-06-05", endDate: "2024-06-07", status: "active", notes: "Conference." },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [trips, setTrips] = useState<Trip[]>(SEED.map((t) => ({ ...t })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addTrip = useCallback((t: Trip) => setTrips((prev) => [...prev, t]), []);
  return (
    <AppContext.Provider value={{ route, trips, navigate, addTrip }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
