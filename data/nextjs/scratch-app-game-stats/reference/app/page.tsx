"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { GamesPage } from "./games/page";
import { PlayersPage } from "./players/page";
import { LeaderboardPage } from "./leaderboard/page";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "games" && <GamesPage />}
      {route === "players" && <PlayersPage />}
      {route === "leaderboard" && <LeaderboardPage />}
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
