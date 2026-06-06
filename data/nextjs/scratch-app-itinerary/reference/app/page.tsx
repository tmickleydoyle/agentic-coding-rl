import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import SchedulePage from "./schedule/page";
import AddActivityPage from "./add-activity/page";
import MapViewPage from "./map-view/page";

function Shell() {
  const { route, activities } = useApp();
  const maxDay = activities.length === 0 ? 0 : Math.max(...activities.map((a) => a.day));
  const totalCost = activities.reduce((s, a) => s + a.cost, 0);

  let content: React.ReactNode;
  if (route === "/schedule") content = <SchedulePage />;
  else if (route === "/add-activity") content = <AddActivityPage />;
  else if (route === "/map-view") content = <MapViewPage />;
  else content = (
    <div data-testid="home-page">
      <h1>My Itinerary</h1>
      <p data-testid="home-total-days">{maxDay}</p>
      <p data-testid="home-total-activities">{activities.length}</p>
      <p data-testid="home-total-cost">{totalCost}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      {content}
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
