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
          <h1>Hostel Reviews</h1>
          <p data-testid="home-review-count">0</p>
          <p data-testid="home-avg-rating">N/A</p>
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
