import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { TrackerPage } from "./tracker/page";
import { AddFoodPage } from "./add-food/page";
import { GoalsPage } from "./goals/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "tracker" && <TrackerPage />}
      {route === "add-food" && <AddFoodPage />}
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
