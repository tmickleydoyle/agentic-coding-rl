"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { FeedPage } from "./feed/page";
import { ComposePage } from "./compose/page";
import { QueuePage } from "./queue/page";
import { AccountsPage } from "./accounts/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "feed" && <FeedPage />}
        {route === "compose" && <ComposePage />}
        {route === "queue" && <QueuePage />}
        {route === "accounts" && <AccountsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
