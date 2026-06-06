import React, { createContext, useContext, useState } from "react";
import type { Route, Tutor, Booking, Review } from "../lib/types";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  tutors: Tutor[];
  setTutors: (t: Tutor[]) => void;
  bookings: Booking[];
  setBookings: (b: Booking[]) => void;
  reviews: Review[];
  setReviews: (r: Review[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  tutors: [],
  setTutors: () => {},
  bookings: [],
  setBookings: () => {},
  reviews: [],
  setReviews: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  return (
    <AppContext.Provider value={{ route, setRoute, tutors, setTutors, bookings, setBookings, reviews, setReviews }}>
      {children}
    </AppContext.Provider>
  );
}
