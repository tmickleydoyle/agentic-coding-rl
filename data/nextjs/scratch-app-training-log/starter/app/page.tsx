"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CalendarPage } from "./calendar/page";
import { ExercisesPage } from "./exercises/page";
import { GoalsPage } from "./goals/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "calendar" && <CalendarPage />}
      {route === "exercises" && <ExercisesPage />}
      {route === "goals" && <GoalsPage />}
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
