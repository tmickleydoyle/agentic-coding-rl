import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ContactsPage } from "./contacts/page";
import { NotesPage } from "./notes/page";
import { TagsPage } from "./tags/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="contact-count">0</div>
      <div data-testid="recent-contacts"></div>
      <div data-testid="quick-add-form">
        <input data-testid="quick-name" placeholder="Name" />
        <input data-testid="quick-company" placeholder="Company" />
        <input data-testid="quick-email" placeholder="Email" />
        <button data-testid="quick-add-btn">Add Contact</button>
      </div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "contacts" && <ContactsPage />}
      {route === "notes" && <NotesPage />}
      {route === "tags" && <TagsPage />}
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
