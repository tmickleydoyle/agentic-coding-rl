import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { SpeakersPage } from "./speakers/page";
import { TalksPage } from "./talks/page";
import { EventsPage } from "./events/page";
import { getSpeakers, getTalks, getEvents } from "../lib/store";

function Dashboard() {
  const speakers = getSpeakers();
  const talks = getTalks();
  const events = getEvents();
  const watched = talks.filter((t) => t.watched).length;

  return (
    <div data-testid="dashboard-page">
      <h2>Speaker Tracker Dashboard</h2>
      <div data-testid="speaker-count">{speakers.length}</div>
      <div data-testid="watched-count">{watched}</div>
      <div data-testid="upcoming-events">{events.length}</div>
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
