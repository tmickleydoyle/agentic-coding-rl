import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <div data-testid="home-page"><h1>Homework Helper</h1></div>}
        {route === "assignments" && <div data-testid="assignments-page"><h2>Assignments</h2></div>}
        {route === "subjects" && <div data-testid="subjects-page"><h2>Subjects & Notes</h2></div>}
        {route === "progress" && <div data-testid="progress-page"><h2>Progress</h2></div>}
      </main>
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
