import React, { createContext, useContext, useState, useCallback } from "react";
import type { HostelReview } from "../lib/types";

interface AppState {
  route: string;
  reviews: HostelReview[];
  navigate: (r: string) => void;
  addReview: (r: HostelReview) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  reviews: [],
  navigate: () => {},
  addReview: () => {},
});

const SEED: HostelReview[] = [
  { id: "1", hostelName: "Sakura Hostel", city: "Tokyo", country: "Japan", rating: 5, cleanliness: 5, location: 4, value: 5, date: "2024-03-15", comment: "Perfect!" },
  { id: "2", hostelName: "Casa Bella", city: "Rome", country: "Italy", rating: 4, cleanliness: 4, location: 5, value: 3, date: "2024-05-02", comment: "Great location." },
  { id: "3", hostelName: "Budget Inn", city: "Bangkok", country: "Thailand", rating: 2, cleanliness: 2, location: 3, value: 4, date: "2024-04-10", comment: "Not great." },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [reviews, setReviews] = useState<HostelReview[]>(SEED.map((r) => ({ ...r })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addReview = useCallback((r: HostelReview) => setReviews((prev) => [...prev, r]), []);
  return (
    <AppContext.Provider value={{ route, reviews, navigate, addReview }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
