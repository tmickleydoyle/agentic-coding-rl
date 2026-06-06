import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import EmployeesPage from "./employees/page";
import TasksPage from "./tasks/page";
import ChecklistPage from "./checklist/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/") content = <DashboardPage />;
  else if (route === "/employees") content = <EmployeesPage />;
  else if (route === "/tasks") content = <TasksPage />;
  else if (route === "/checklist") content = <ChecklistPage />;
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
