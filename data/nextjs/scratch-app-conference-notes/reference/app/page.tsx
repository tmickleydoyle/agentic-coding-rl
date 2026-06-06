import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ConferencesPage } from "./conferences/page";
import { TalksPage } from "./talks/page";
import { SpeakersPage } from "./speakers/page";
import { getConferences, getTalks, getSpeakers } from "../lib/store";

function Dashboard() {
  const conferences = getConferences();
  const talks = getTalks();
  const speakers = getSpeakers();

  return (
    <div data-testid="dashboard-page">
      <h2>Conference Notes Dashboard</h2>
      <div data-testid="conference-count">{conferences.length}</div>
      <div data-testid="talk-count">{talks.length}</div>
      <div data-testid="speaker-count">{speakers.length}</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "conferences" && <ConferencesPage />}
      {route === "talks" && <TalksPage />}
      {route === "speakers" && <SpeakersPage />}
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
