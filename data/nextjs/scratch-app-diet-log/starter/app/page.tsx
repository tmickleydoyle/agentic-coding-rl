import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { LogPage } from "./log/page";
import { AddEntryPage } from "./add-entry/page";
import { SummaryPage } from "./summary/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "log" && <LogPage />}
      {route === "add-entry" && <AddEntryPage />}
      {route === "summary" && <SummaryPage />}
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
