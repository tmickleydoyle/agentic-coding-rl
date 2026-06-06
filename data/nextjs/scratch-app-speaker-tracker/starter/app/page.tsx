import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { SpeakersPage } from "./speakers/page";
import { TalksPage } from "./talks/page";
import { EventsPage } from "./events/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Speaker Tracker Dashboard</h2>
      <div data-testid="speaker-count">0</div>
      <div data-testid="watched-count">0</div>
      <div data-testid="upcoming-events">0</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "speakers" && <SpeakersPage />}
      {route === "talks" && <TalksPage />}
      {route === "events" && <EventsPage />}
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
