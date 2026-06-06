import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import VisasPage from "./visas/page";
import AddVisaPage from "./add-visa/page";
import RemindersPage from "./reminders/page";

function Shell() {
  const { route, visas } = useApp();
  const applied = visas.filter((v) => v.status === "applied").length;
  const approved = visas.filter((v) => v.status === "approved").length;
  const expired = visas.filter((v) => v.status === "expired").length;

  let content: React.ReactNode;
  if (route === "/visas") content = <VisasPage />;
  else if (route === "/add-visa") content = <AddVisaPage />;
  else if (route === "/reminders") content = <RemindersPage />;
  else content = (
    <div data-testid="home-page">
      <h1>Visa Tracker</h1>
      <p data-testid="home-applied-count">{applied}</p>
      <p data-testid="home-approved-count">{approved}</p>
      <p data-testid="home-expired-count">{expired}</p>
    </div>
  );

  return (
    <div>
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
