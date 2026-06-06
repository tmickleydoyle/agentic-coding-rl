"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { BracketPage } from "./bracket/page";
import { PlayersPage } from "./players/page";
import { ResultsPage } from "./results/page";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "bracket" && <BracketPage />}
      {route === "players" && <PlayersPage />}
      {route === "results" && <ResultsPage />}
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
