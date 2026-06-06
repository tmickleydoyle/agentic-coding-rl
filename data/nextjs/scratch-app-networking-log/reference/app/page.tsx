import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { EventsPage } from "./events/page";
import { ConnectionsPage } from "./connections/page";
import { FollowupsPage } from "./followups/page";
import { getEvents, getConnections, getFollowUps } from "../lib/store";

function Dashboard() {
  const events = getEvents();
  const connections = getConnections();
  const followUps = getFollowUps();
  const pending = followUps.filter((f) => !f.done).length;

  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="event-count">{events.length}</div>
      <div data-testid="connection-count">{connections.length}</div>
      <div data-testid="pending-followups">{pending}</div>
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
