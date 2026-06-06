import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "/" && (
        <div data-testid="home-page">
          <h1>Visa Tracker</h1>
          <p data-testid="home-applied-count">0</p>
          <p data-testid="home-approved-count">0</p>
          <p data-testid="home-expired-count">0</p>
        </div>
      )}
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
