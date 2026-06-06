import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import TutorsPage from "./tutors/page";
import BookingsPage from "./bookings/page";
import SubjectsPage from "./subjects/page";

function Shell() {
  const { route, tutors, bookings } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && (
          <div data-testid="home-page">
            <h1>Tutoring Platform</h1>
            <div data-testid="stat-tutors">{tutors.length} tutors</div>
            <div data-testid="stat-bookings">{bookings.length} bookings</div>
            <div data-testid="stat-available">{tutors.filter(t => t.available).length} available now</div>
          </div>
        )}
        {route === "tutors" && <TutorsPage />}
        {route === "bookings" && <BookingsPage />}
        {route === "subjects" && <SubjectsPage />}
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
