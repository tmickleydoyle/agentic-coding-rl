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
        {route === "calendar" && <div data-testid="calendar-page"><h1>Calendar</h1></div>}
        {route === "drafts" && <div data-testid="drafts-page"><h1>Drafts</h1></div>}
        {route === "publish" && <div data-testid="publish-page"><h1>Publish</h1></div>}
        {route === "analytics" && <div data-testid="analytics-page"><h1>Analytics</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
