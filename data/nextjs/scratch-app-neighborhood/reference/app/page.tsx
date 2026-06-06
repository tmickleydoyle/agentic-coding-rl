import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DirectoryPage } from "./directory/page";
import { IssuesPage } from "./issues/page";
import { AnnouncementsPage } from "./announcements/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "directory" && <DirectoryPage />}
      {route === "issues" && <IssuesPage />}
      {route === "announcements" && <AnnouncementsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
