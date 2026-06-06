import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import TripsPage from "./trips/page";
import NewTripPage from "./new-trip/page";
import CalendarPage from "./calendar/page";

function Shell() {
  const { route, trips } = useApp();
  const planned = trips.filter((t) => t.status === "planned").length;
  const active = trips.filter((t) => t.status === "active").length;
  const done = trips.filter((t) => t.status === "done").length;

  let content: React.ReactNode;
  if (route === "/trips") content = <TripsPage />;
  else if (route === "/new-trip") content = <NewTripPage />;
  else if (route === "/calendar") content = <CalendarPage />;
  else content = (
    <div data-testid="home-page">
      <h1>Trip Planner</h1>
      <p data-testid="home-planned-count">{planned}</p>
      <p data-testid="home-active-count">{active}</p>
      <p data-testid="home-done-count">{done}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      {content}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
