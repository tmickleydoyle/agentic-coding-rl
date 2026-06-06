"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CalendarPage } from "./calendar/page";
import { DraftsPage } from "./drafts/page";
import { PublishPage } from "./publish/page";
import { AnalyticsPage } from "./analytics/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "calendar" && <CalendarPage />}
        {route === "drafts" && <DraftsPage />}
        {route === "publish" && <PublishPage />}
        {route === "analytics" && <AnalyticsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
