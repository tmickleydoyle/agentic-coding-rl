"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { BoardPage } from "./board/page";
import { PicksPage } from "./picks/page";
import { TeamsPage } from "./teams/page";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "board" && <BoardPage />}
      {route === "picks" && <PicksPage />}
      {route === "teams" && <TeamsPage />}
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
