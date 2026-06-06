import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { InventoryPage } from "./inventory/page";
import { DonationsPage } from "./donations/page";
import { ClientsPage } from "./clients/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "inventory" && <InventoryPage />}
      {route === "donations" && <DonationsPage />}
      {route === "clients" && <ClientsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
