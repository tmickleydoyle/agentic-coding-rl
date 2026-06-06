import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { LogWaterPage } from "./log-water/page";
import { HistoryPage } from "./history/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "dashboard" && <DashboardPage />}
      {route === "log-water" && <LogWaterPage />}
      {route === "history" && <HistoryPage />}
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
