import React, { useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ContactsPage } from "./contacts/page";
import { NotesPage } from "./notes/page";
import { TagsPage } from "./tags/page";
import { getContacts, addContact } from "../lib/store";

function Dashboard() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [, forceUpdate] = useState(0);

  const contacts = getContacts();
  const recent = [...contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const handleAdd = () => {
    if (!name.trim() || !company.trim() || !email.trim()) return;
    addContact({ name: name.trim(), company: company.trim(), email: email.trim() });
    setName("");
    setCompany("");
    setEmail("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="contact-count">{contacts.length}</div>
      <div data-testid="recent-contacts">
        {recent.map((c) => (
          <div key={c.id} data-testid="recent-contact-item">
            {c.name}
          </div>
        ))}
      </div>
      <div data-testid="quick-add-form">
        <input data-testid="quick-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="quick-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        <input data-testid="quick-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button data-testid="quick-add-btn" onClick={handleAdd}>Add Contact</button>
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
