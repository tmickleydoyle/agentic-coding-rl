import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/schedule")} data-testid="nav-schedule">Schedule</button>
      <button onClick={() => navigate("/add-activity")} data-testid="nav-add-activity">Add Activity</button>
      <button onClick={() => navigate("/map-view")} data-testid="nav-map-view">Map View</button>
    </nav>
  );
}
