import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { WeeklyPlanPage } from "./weekly-plan/page";
import { AddMealPage } from "./add-meal/page";
import { MealDetailPage } from "./meal-detail/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "weekly-plan" && <WeeklyPlanPage />}
      {route === "add-meal" && <AddMealPage />}
      {route === "meal-detail" && <MealDetailPage />}
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
