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
          <h1>Currency Log</h1>
          <p data-testid="home-exchange-count">0</p>
          <p data-testid="home-total-fees">0.00</p>
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
