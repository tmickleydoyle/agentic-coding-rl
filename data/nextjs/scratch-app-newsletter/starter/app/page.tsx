"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "campaigns" && <div data-testid="campaigns-page"><h1>Campaigns</h1></div>}
        {route === "subscribers" && <div data-testid="subscribers-page"><h1>Subscribers</h1></div>}
        {route === "templates" && <div data-testid="templates-page"><h1>Templates</h1></div>}
        {route === "stats" && <div data-testid="stats-page"><h1>Stats</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
