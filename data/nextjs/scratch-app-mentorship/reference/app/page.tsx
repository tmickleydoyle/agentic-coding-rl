import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { MentorsPage } from "./mentors/page";
import { SessionsPage } from "./sessions/page";
import { GoalsPage } from "./goals/page";
import { getMentors, getSessions, getGoals } from "../lib/store";

function Dashboard() {
  const mentors = getMentors();
  const sessions = getSessions();
  const goals = getGoals();
  const activeMentors = mentors.filter((m) => m.active).length;
  const upcomingCount = sessions.filter((s) => s.upcoming).length;
  const completed = goals.filter((g) => g.completed).length;

  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="mentor-count">{activeMentors}</div>
      <div data-testid="upcoming-count">{upcomingCount}</div>
      <div data-testid="goals-progress">{completed}/{goals.length} completed</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "mentors" && <MentorsPage />}
      {route === "sessions" && <SessionsPage />}
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
