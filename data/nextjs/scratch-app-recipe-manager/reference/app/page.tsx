import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { AddRecipePage } from "./add-recipe/page";
import { ViewRecipePage } from "./view-recipe/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "dashboard" && <DashboardPage />}
      {route === "add-recipe" && <AddRecipePage />}
      {route === "view-recipe" && <ViewRecipePage />}
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
