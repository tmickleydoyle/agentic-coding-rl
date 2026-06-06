import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import InjuriesPage from "./injuries/page";
import TreatmentPage from "./treatment/page";
import TimelinePage from "./timeline/page";
import NotesPage from "./notes/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "injuries" && <InjuriesPage />}
      {route === "treatment" && <TreatmentPage />}
      {route === "timeline" && <TimelinePage />}
      {route === "notes" && <NotesPage />}
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
