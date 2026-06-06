import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import AssignmentsPage from "./assignments/page";
import SubjectsPage from "./subjects/page";
import ProgressPage from "./progress/page";

function Shell() {
  const { route, assignments } = useApp();
  const todo = assignments.filter(a => a.status === "todo").length;
  const inProgress = assignments.filter(a => a.status === "in-progress").length;
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && (
          <div data-testid="home-page">
            <h1>Homework Helper</h1>
            <div data-testid="stat-todo">{todo} to do</div>
            <div data-testid="stat-in-progress">{inProgress} in progress</div>
            <div data-testid="stat-total">{assignments.length} total</div>
          </div>
        )}
        {route === "assignments" && <AssignmentsPage />}
        {route === "subjects" && <SubjectsPage />}
        {route === "progress" && <ProgressPage />}
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
