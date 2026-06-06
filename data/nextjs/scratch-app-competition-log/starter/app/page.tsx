import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import CompetitionsPage from "./competitions/page";
import ResultsPage from "./results/page";
import RankingsPage from "./rankings/page";
import HistoryPage from "./history/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "competitions" && <CompetitionsPage />}
      {route === "results" && <ResultsPage />}
      {route === "rankings" && <RankingsPage />}
      {route === "history" && <HistoryPage />}
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
