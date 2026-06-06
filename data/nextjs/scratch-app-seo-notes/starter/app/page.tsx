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
        {route === "keywords" && <div data-testid="keywords-page"><h1>Keywords</h1></div>}
        {route === "pages" && <div data-testid="pages-page"><h1>Pages</h1></div>}
        {route === "backlinks" && <div data-testid="backlinks-page"><h1>Backlinks</h1></div>}
        {route === "reports" && <div data-testid="reports-page"><h1>Reports</h1></div>}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
