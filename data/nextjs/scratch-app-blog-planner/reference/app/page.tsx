"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { PostsPage } from "./posts/page";
import { IdeasPage } from "./ideas/page";
import { SchedulePage } from "./schedule/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "dashboard" && <DashboardPage />}
        {route === "posts" && <PostsPage />}
        {route === "ideas" && <IdeasPage />}
        {route === "schedule" && <SchedulePage />}
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
