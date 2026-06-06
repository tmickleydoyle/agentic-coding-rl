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
        {route === "overview" && <div data-testid="overview-page"><h1>Overview</h1></div>}
        {route === "events" && <div data-testid="events-page"><h1>Events</h1></div>}
        {route === "funnels" && <div data-testid="funnels-page"><h1>Funnels</h1></div>}
        {route === "segments" && <div data-testid="segments-page"><h1>Segments</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
