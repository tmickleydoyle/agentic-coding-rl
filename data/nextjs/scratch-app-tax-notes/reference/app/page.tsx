import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { OverviewPage } from "./overview/page";
import { DocumentsPage } from "./documents/page";
import { DeductionsPage } from "./deductions/page";
import { NotesPage } from "./notes/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "overview" && <OverviewPage />}
        {route === "documents" && <DocumentsPage />}
        {route === "deductions" && <DeductionsPage />}
        {route === "notes" && <NotesPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
