import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <div data-testid="home-page"><h1>Language Exchange</h1></div>}
        {route === "vocabulary" && <div data-testid="vocabulary-page"><h2>Vocabulary</h2></div>}
        {route === "partners" && <div data-testid="partners-page"><h2>Language Partners</h2></div>}
        {route === "sessions" && <div data-testid="sessions-page"><h2>Practice Sessions</h2></div>}
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
