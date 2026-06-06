import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { BillsPage } from "./bills/page";
import { CalendarPage } from "./calendar/page";
import { SettingsPage } from "./settings/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "dashboard" && <DashboardPage />}
        {route === "bills" && <BillsPage />}
        {route === "calendar" && <CalendarPage />}
        {route === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
