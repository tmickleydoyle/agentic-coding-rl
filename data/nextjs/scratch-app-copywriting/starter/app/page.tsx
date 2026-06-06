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
        {route === "projects" && <div data-testid="projects-page"><h1>Projects</h1></div>}
        {route === "briefs" && <div data-testid="briefs-page"><h1>Briefs</h1></div>}
        {route === "copies" && <div data-testid="copies-page"><h1>Copies</h1></div>}
        {route === "review" && <div data-testid="review-page"><h1>Review</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
