"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ProjectsPage } from "./projects/page";
import { BriefsPage } from "./briefs/page";
import { CopiesPage } from "./copies/page";
import { ReviewPage } from "./review/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "projects" && <ProjectsPage />}
        {route === "briefs" && <BriefsPage />}
        {route === "copies" && <CopiesPage />}
        {route === "review" && <ReviewPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
