"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CampaignsPage } from "./campaigns/page";
import { SubscribersPage } from "./subscribers/page";
import { TemplatesPage } from "./templates/page";
import { StatsPage } from "./stats/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "campaigns" && <CampaignsPage />}
        {route === "subscribers" && <SubscribersPage />}
        {route === "templates" && <TemplatesPage />}
        {route === "stats" && <StatsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
