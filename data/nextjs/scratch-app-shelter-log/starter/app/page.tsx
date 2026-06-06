import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ResidentsPage } from "./residents/page";
import { BedsPage } from "./beds/page";
import { ServicesPage } from "./services/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "residents" && <ResidentsPage />}
      {route === "beds" && <BedsPage />}
      {route === "services" && <ServicesPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
