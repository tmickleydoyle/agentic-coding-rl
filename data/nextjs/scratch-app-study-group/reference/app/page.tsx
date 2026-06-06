import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import StudyGroupHome from "./study-group/page";
import GroupsPage from "./groups/page";
import MembersPage from "./members/page";
import SessionsPage from "./sessions/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <StudyGroupHome />}
        {route === "groups" && <GroupsPage />}
        {route === "members" && <MembersPage />}
        {route === "sessions" && <SessionsPage />}
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
