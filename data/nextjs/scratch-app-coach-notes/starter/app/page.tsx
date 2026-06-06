import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import AthletesPage from "./athletes/page";
import SessionsPage from "./sessions/page";
import DrillsPage from "./drills/page";
import ReviewPage from "./review/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "athletes" && <AthletesPage />}
      {route === "sessions" && <SessionsPage />}
      {route === "drills" && <DrillsPage />}
      {route === "review" && <ReviewPage />}
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
