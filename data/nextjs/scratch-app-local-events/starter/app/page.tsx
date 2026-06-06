import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CalendarPage } from "./calendar/page";
import { CreatePage } from "./create/page";
import { RegistrationsPage } from "./registrations/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "calendar" && <CalendarPage />}
      {route === "create" && <CreatePage />}
      {route === "registrations" && <RegistrationsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
