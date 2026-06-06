import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import ProfilePage from "./profile/page";
import MetricsPage from "./metrics/page";
import EventsPage from "./events/page";
import AchievementsPage from "./achievements/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "profile" && <ProfilePage />}
      {route === "metrics" && <MetricsPage />}
      {route === "events" && <EventsPage />}
      {route === "achievements" && <AchievementsPage />}
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
