import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CertificationsPage } from "./certifications/page";
import { StudyPage } from "./study/page";
import { ExamsPage } from "./exams/page";
import { getCertifications, getExams } from "../lib/store";

function Dashboard() {
  const certs = getCertifications();
  const exams = getExams();
  const earned = certs.filter((c) => c.status === "earned").length;
  const inProgress = certs.filter((c) => c.status === "studying").length;
  const futureExams = exams.filter((e) => e.date > new Date().toISOString().slice(0, 10));
  const nextExam = futureExams.length > 0 ? futureExams.sort((a, b) => a.date.localeCompare(b.date))[0].date : "None scheduled";

  return (
    <div data-testid="dashboard-page">
      <h2>Certification Dashboard</h2>
      <div data-testid="earned-count">{earned}</div>
      <div data-testid="inprogress-count">{inProgress}</div>
      <div data-testid="next-exam">{nextExam}</div>
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
