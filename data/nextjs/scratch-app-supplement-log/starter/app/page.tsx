import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { SchedulePage } from "./schedule/page";
import { AddSupplementPage } from "./add-supplement/page";
import { LogDosePage } from "./log-dose/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "schedule" && <SchedulePage />}
      {route === "add-supplement" && <AddSupplementPage />}
      {route === "log-dose" && <LogDosePage />}
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
