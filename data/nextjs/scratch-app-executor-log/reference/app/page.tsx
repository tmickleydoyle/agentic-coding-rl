import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { TasksPage } from "./tasks/page";
import { ContactsPage } from "./contacts/page";
import { ProgressPage } from "./progress/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/contacts") content = <ContactsPage />;
  else if (route === "/progress") content = <ProgressPage />;
  else content = <TasksPage />;
  return (
    <div data-testid="app-shell">
      <NavBar />
      {content}
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
