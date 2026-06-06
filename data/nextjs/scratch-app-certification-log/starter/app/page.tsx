import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CertificationsPage } from "./certifications/page";
import { StudyPage } from "./study/page";
import { ExamsPage } from "./exams/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Certification Dashboard</h2>
      <div data-testid="earned-count">0</div>
      <div data-testid="inprogress-count">0</div>
      <div data-testid="next-exam">None scheduled</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "certifications" && <CertificationsPage />}
      {route === "study" && <StudyPage />}
      {route === "exams" && <ExamsPage />}
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
