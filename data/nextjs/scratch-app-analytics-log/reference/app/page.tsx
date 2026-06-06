"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { OverviewPage } from "./overview/page";
import { EventsPage } from "./events/page";
import { FunnelsPage } from "./funnels/page";
import { SegmentsPage } from "./segments/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "overview" && <OverviewPage />}
        {route === "events" && <EventsPage />}
        {route === "funnels" && <FunnelsPage />}
        {route === "segments" && <SegmentsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
