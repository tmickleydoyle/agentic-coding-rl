import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import JobsPage from "./jobs/page";
import CandidatesPage from "./candidates/page";
import InterviewsPage from "./interviews/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/") content = <DashboardPage />;
  else if (route === "/jobs") content = <JobsPage />;
  else if (route === "/candidates") content = <CandidatesPage />;
  else if (route === "/interviews") content = <InterviewsPage />;
  else content = <div data-testid="not-found">404</div>;

  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">{content}</main>
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
