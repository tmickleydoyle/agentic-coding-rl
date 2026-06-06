import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CampaignsPage } from "./campaigns/page";
import { DonorsPage } from "./donors/page";
import { LeaderboardPage } from "./leaderboard/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "campaigns" && <CampaignsPage />}
      {route === "donors" && <DonorsPage />}
      {route === "leaderboard" && <LeaderboardPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
