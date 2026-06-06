"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "feed" && <div data-testid="feed-page"><h1>Feed</h1></div>}
        {route === "compose" && <div data-testid="compose-page"><h1>Compose</h1></div>}
        {route === "queue" && <div data-testid="queue-page"><h1>Queue</h1></div>}
        {route === "accounts" && <div data-testid="accounts-page"><h1>Accounts</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
