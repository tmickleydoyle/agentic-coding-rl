"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { RosterPage } from "./roster/page";
import { WaiversPage } from "./waivers/page";
import { StandingsPage } from "./standings/page";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "roster" && <RosterPage />}
      {route === "waivers" && <WaiversPage />}
      {route === "standings" && <StandingsPage />}
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
