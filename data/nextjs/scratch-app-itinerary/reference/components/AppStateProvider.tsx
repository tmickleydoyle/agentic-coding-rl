import React, { createContext, useContext, useState, useCallback } from "react";
import type { Activity } from "../lib/types";

interface AppState {
  route: string;
  activities: Activity[];
  navigate: (r: string) => void;
  addActivity: (a: Activity) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  activities: [],
  navigate: () => {},
  addActivity: () => {},
});

const SEED: Activity[] = [
  { id: "1", day: 1, time: "09:00", title: "Check in Hotel", location: "Tokyo", category: "Accommodation", duration: 60, notes: "", cost: 0 },
  { id: "2", day: 1, time: "14:00", title: "Senso-ji Temple", location: "Tokyo", category: "Sightseeing", duration: 120, notes: "Famous temple", cost: 0 },
  { id: "3", day: 2, time: "08:00", title: "Breakfast at Tsukiji", location: "Tokyo", category: "Food", duration: 90, notes: "Fresh sushi", cost: 25 },
  { id: "4", day: 2, time: "13:00", title: "Shinkansen to Kyoto", location: "Tokyo", category: "Transport", duration: 140, notes: "", cost: 80 },
  { id: "5", day: 3, time: "10:00", title: "Fushimi Inari", location: "Kyoto", category: "Sightseeing", duration: 180, notes: "Thousands of torii gates", cost: 0 },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [activities, setActivities] = useState<Activity[]>(SEED.map((a) => ({ ...a })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addActivity = useCallback((a: Activity) => setActivities((prev) => [...prev, a]), []);
  return (
    <AppContext.Provider value={{ route, activities, navigate, addActivity }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
