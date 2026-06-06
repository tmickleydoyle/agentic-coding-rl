import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import MealsPage from "./meals/page";
import FoodsPage from "./foods/page";
import DailyPage from "./daily/page";
import SummaryPage from "./summary/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "meals" && <MealsPage />}
      {route === "foods" && <FoodsPage />}
      {route === "daily" && <DailyPage />}
      {route === "summary" && <SummaryPage />}
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
