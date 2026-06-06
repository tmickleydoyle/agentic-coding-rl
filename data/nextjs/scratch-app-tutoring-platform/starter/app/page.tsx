import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <div data-testid="home-page"><h1>Tutoring Platform</h1></div>}
        {route === "tutors" && <div data-testid="tutors-page"><h2>Find a Tutor</h2></div>}
        {route === "bookings" && <div data-testid="bookings-page"><h2>Bookings</h2></div>}
        {route === "subjects" && <div data-testid="subjects-page"><h2>Browse by Subject</h2></div>}
      </main>
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
