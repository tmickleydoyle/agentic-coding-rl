import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import SessionsPage from "./sessions/page";
import ExercisesPage from "./exercises/page";
import HistoryPage from "./history/page";
import StatsPage from "./stats/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "sessions" && <SessionsPage />}
      {route === "exercises" && <ExercisesPage />}
      {route === "history" && <HistoryPage />}
      {route === "stats" && <StatsPage />}
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
