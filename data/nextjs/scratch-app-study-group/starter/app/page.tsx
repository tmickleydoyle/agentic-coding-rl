import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <div data-testid="home-page"><h1>Study Groups</h1></div>}
        {route === "groups" && <div data-testid="groups-page"><h2>Study Groups</h2></div>}
        {route === "members" && <div data-testid="members-page"><h2>Members</h2></div>}
        {route === "sessions" && <div data-testid="sessions-page"><h2>Study Sessions</h2></div>}
      </main>
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
