import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { EventsPage } from "./events/page";
import { ConnectionsPage } from "./connections/page";
import { FollowupsPage } from "./followups/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="event-count">0</div>
      <div data-testid="connection-count">0</div>
      <div data-testid="pending-followups">0</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "events" && <EventsPage />}
      {route === "connections" && <ConnectionsPage />}
      {route === "followups" && <FollowupsPage />}
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
