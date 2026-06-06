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
        {route === "dashboard" && <div data-testid="dashboard-page"><h1>Dashboard</h1></div>}
        {route === "posts" && <div data-testid="posts-page"><h1>Posts</h1></div>}
        {route === "ideas" && <div data-testid="ideas-page"><h1>Ideas</h1></div>}
        {route === "schedule" && <div data-testid="schedule-page"><h1>Schedule</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
